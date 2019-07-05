package main

import (
	"encoding/json"
	"flag"
	"fmt"
	log "github.com/sirupsen/logrus"
	"gocv.io/x/gocv"
	"image"
	"image/color"
	"time"
)

/*
TODO:
 - pprof
*/

const (
	width  = 320
	height = 240
	rate   = 24

	scale = 64.33 / 2

	minArea   = width * height / 200
	numFrames = 10

	default_port = 5000
)

type frameGrabber func(dst *gocv.Mat) bool

func fromWebCam() frameGrabber {
	webcam := setupWebcam()
	return func(dst *gocv.Mat) bool {
		ok := webcam.Read(dst)
		if !ok {
			return ok
		}
		t("convert-bw", func() {
			gocv.CvtColor(*dst, dst, gocv.ColorBGRToGray)
		})
		return ok
	}
}

func fromRaspi(frames chan []byte) frameGrabber {
	return func(dst *gocv.Mat) bool {
		frame := <-frames
		res, err := gocv.NewMatFromBytes(height, width, gocv.MatTypeCV8U, frame)
		*dst = res
		if err != nil {
			panic(err)
		}
		return true
	}
}

func main() {
	var filename string
	var port int
	var instance string
	flag.StringVar(&instance, "instance", "", "instance name to run as")
	flag.StringVar(&filename, "filename", "", "stream recording from raw file")
	flag.IntVar(&port, "port", default_port, "port to listen on")
	flag.Parse()

	fmt.Println("filename: ", filename)

	if instance == "" {
		log.Fatalf("instance not specified")
	}

	cfg := getConfig(instance)

	go serve(port)

	redisPublish := NewRedisPublisher(cfg.RedisServer)
	defer redisPublish.Stop()
	go redisPublish.Run()

	var grabber frameGrabber

	if filename != "" {
		fmt.Println("Streaming from file: ", filename)
		frames, err := runFileStreamer(filename)
		if err != nil {
			panic(err)
		}
		grabber = fromRaspi(frames)
	} else {
		frames, err := runRaspiVid()
		if err == nil {
			fmt.Println("Using raspiVid")
			grabber = fromRaspi(frames)
		} else {
			fmt.Println("Falling back to gocv: ", err)
			grabber = fromWebCam()
		}
	}
	// TODO: camera warmup

	avg := gocv.NewMat()
	frameDelta := gocv.NewMat()
	thresh := gocv.NewMat()
	ffmpegBuf := gocv.NewMat()
	blurred := gocv.NewMat()
	orig := gocv.NewMat()

	var frameTimes []time.Time

	ffmpegFeeder := runFfmpeg()
	go sendToStepper()

	for frameNo := 0; ; frameNo++ {
		t("whole-frame", func() {
			var ok bool

			t("read-frame", func() {
				ok = grabber(&orig)
			})
			if !ok {
				fmt.Println("Unable to read frame")
				return
			}

			t("flip", func() {
				gocv.Flip(orig, &orig, 1)
			})

			t("blur", func() {
				gocv.GaussianBlur(orig, &blurred, image.Point{X: 7, Y: 7}, 0, 0, gocv.BorderDefault)
			})

			if avg.Empty() {
				t("copy", func() {
					blurred.CopyTo(&avg)
				})
			}

			t("add-weighted", func() {
				gocv.AddWeighted(blurred, 0.35, avg, 0.65, 0, &avg)
			})

			t("abs-diff", func() {
				gocv.AbsDiff(blurred, avg, &frameDelta)
			})

			t("threshold", func() {
				gocv.Threshold(frameDelta, &thresh, 16, 255, gocv.ThresholdBinary)
			})

			var contours [][]image.Point
			t("contours", func() {
				contours = gocv.FindContours(thresh, gocv.RetrievalExternal, gocv.ChainApproxSimple)
			})

			maxArea := 0.0
			var maxRect image.Rectangle

			for _, c := range contours {
				area := gocv.ContourArea(c)
				if area < minArea {
					continue
				}
				if area > maxArea {
					maxArea = area
					maxRect = gocv.BoundingRect(c)
				}
				//fmt.Println(i, area)
			}

			t("copy", func() {
				orig.CopyTo(&ffmpegBuf)
			})

			err := orig.Close()
			if err != nil {
				panic(err)
			}

			if maxArea > 0 {
				gocv.Rectangle(&thresh, maxRect, color.RGBA{R: 128, G: 128, B: 128, A: 255}, 2)
				gocv.Rectangle(&ffmpegBuf, maxRect, color.RGBA{R: 128, G: 128, B: 128, A: 255}, 2)

				pos := maxRect.Min.X + maxRect.Dx()/2
				half := width / 2
				t := float64(pos-half) / float64(half)
				pos2 := int(scale * t)
				fmt.Println("pos", pos, "t", t, "pos2", pos2)

				msg := MotionDetected{
					MessageHeader{
						Type: "motion-detected",
					},
					MotionDetectedData{
						Position:   float64(pos2),
						CameraName: cfg.CameraName,
					},
				}

				payload, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}
				err = redisPublish.Send(payload)
				if err != nil {
					log.WithError(err).Println("Unable to publish to redis")
				}
			}

			t("ffmpeg", func() {
				if numConnectedWebsockets() == 0 {
					return
				}

				t("put-text", func() {
					currentTime := time.Now().Format("2006-01-02 15:04:05")
					gocv.PutText(
						&ffmpegBuf,
						currentTime,
						image.Point{X: 11, Y: 21},
						gocv.FontHersheySimplex,
						0.5,
						color.RGBA{R: 32, G: 32, B: 32, A: 255},
						2,
					)

					gocv.PutText(
						&ffmpegBuf,
						currentTime,
						image.Point{X: 10, Y: 20},
						gocv.FontHersheySimplex,
						0.5,
						color.RGBA{R: 255, G: 255, B: 255, A: 255},
						2,
					)
				})

				select {
				case ffmpegFeeder <- ffmpegBuf:
				default:
					// TODO: dropped frame counter
				}
			})

			frameProcessed.Inc()
			frameTimes = append(frameTimes, time.Now())
			if len(frameTimes) > numFrames {
				newStart := len(frameTimes) - numFrames
				frameTimes = frameTimes[newStart:]

				if len(frameTimes) != numFrames {
					panic("no")
				}

				newest := frameTimes[len(frameTimes)-1]
				oldest := frameTimes[0]
				count := numFrames - 1

				delta := float64(newest.Sub(oldest)) / float64(time.Second)
				fps := float64(count) / float64(delta)
				if frameNo%24 == 0 && false {
					fmt.Println("FPS:", fps, "delta:", delta, "newest:", newest, "oldest:", oldest)
					for k, v := range times {
						fmt.Println(k, v)
						times[k] = 0
					}
				}
			}
		})
	}
}

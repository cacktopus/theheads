package camera

import (
	"fmt"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	log "github.com/sirupsen/logrus"
	"github.com/soheilhy/cmux"
	"github.com/vrischmann/envconfig"
	"gocv.io/x/gocv"
	"image"
	"image/color"
	"net"
	"time"
)

/*
TODO:
 - pprof
*/

const (
	inputWidth  = 320
	inputHeight = 240

	width  = 320
	height = 240

	rate = 24

	scale = 64.33 / 2

	minArea   = width * height / 400
	numFrames = 10

	warmupFrames = 36
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
		var input gocv.Mat
		var err error
		t("new-mat", func() {
			input, err = gocv.NewMatFromBytes(inputHeight, inputWidth, gocv.MatTypeCV8U, frame)
		})

		t("resize", func() {
			gocv.Resize(input, &input, image.Pt(width, height), 0, 0, gocv.InterpolationNearestNeighbor)
		})

		*dst = input
		if err != nil {
			panic(err)
		}
		return true
	}
}

type Cfg struct {
	Instance string

	Filename string `envconfig:"optional"`

	Port int `envconfig:"default=5000"`

	CenterLine bool `envconfig:"optional"`
	Hflip      bool `envconfig:"default=true"`
	Vflip      bool `envconfig:"default=true"`
}

type Buffer struct {
	data []byte
}

func (f *Buffer) Name() string {
	return "buffer"
}

func Run() {
	env := &Cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	err = raspiStill()
	if err != nil {
		log.WithError(err).Info("Error running raspistill")
	}

	wsBroker := broker.NewBroker()
	go wsBroker.Start()

	promauto.NewCounterFunc(prometheus.CounterOpts{
		Name: "heads_camera_ffmpeg_subscriptions",
	}, func() float64 {
		return float64(wsBroker.SubCount())
	})

	b := broker.NewBroker()
	go b.Start()

	listener, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", env.Port))
	if err != nil {
		panic(err)
	}
	log.WithField("port", env.Port).Info("listening")

	mux := cmux.New(listener)
	httpListener := mux.Match(cmux.HTTP1Fast())
	grpcListener := mux.Match(cmux.Any())
	mux.HandleError(func(err error) bool {
		panic(err)
	})

	go serveGRPC(grpcListener, b)
	go serveHTTP(wsBroker, httpListener, fmt.Sprintf("%d", env.Port))

	go func() {
		err := mux.Serve()
		if err != nil {
			panic(err)
		}
	}()

	var grabber frameGrabber

	if env.Filename != "" {
		fmt.Println("Streaming from file: ", env.Filename)
		frames, err := runFileStreamer(env.Filename)
		if err != nil {
			panic(err)
		}
		grabber = fromRaspi(frames)
	} else {
		var extraArgs []string
		if env.Hflip {
			extraArgs = append(extraArgs, "-hf")
		}
		if env.Vflip {
			extraArgs = append(extraArgs, "-vf")
		}
		frames, err := runRaspiVid(extraArgs...)
		if err == nil {
			fmt.Println("Using raspiVid")
			grabber = fromRaspi(frames)
		} else {
			fmt.Println("Falling back to gocv: ", err)
			grabber = fromWebCam()
		}
	}

	avg := gocv.NewMat()
	frameDelta := gocv.NewMat()
	thresh := gocv.NewMat()
	ffmpegBuf := gocv.NewMat()
	blurred := gocv.NewMat()
	orig := gocv.NewMat()

	var frameTimes []time.Time

	ffmpegFeeder := runFfmpeg(wsBroker)
	go sendToStepper()

	for frameNo := 0; frameNo < warmupFrames; frameNo++ {
		grabber(&orig)
	}

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
				if env.CenterLine {
					sz := orig.Size()
					x := sz[1]
					y := sz[0]
					gocv.Line(
						&orig,
						image.Point{X: x/2 - 1, Y: 0},
						image.Point{X: x/2 - 1, Y: y},
						color.RGBA{B: 128, G: 128, R: 128, A: 128},
						2,
					)
				}
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
				pos2 := -int(scale * t)
				// fmt.Println("pos", pos, "t", t, "pos2", pos2)

				msg := schema.MotionDetected{
					Position:   float64(pos2),
					CameraName: env.Instance,
				}

				b.Publish(msg)
			}

			t("ffmpeg", func() {
				if wsBroker.SubCount() == 0 {
					return
				}

				t("put-text", func() {
					currentTime := time.Now().Format("2006-01-02 15:04:05")
					gocv.PutText(
						&ffmpegBuf,
						currentTime,
						image.Point{X: 13, Y: 23},
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
						color.RGBA{R: 160, G: 160, B: 160, A: 255},
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

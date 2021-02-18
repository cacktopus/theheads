package camera

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/motion_detector"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/soheilhy/cmux"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"image"
	"net"
	"time"
)

const (
	fovScale     = 64.33 / 2
	warmupFrames = 36
)

type frameGrabber func(dst *gocv.Mat) bool

func fromWebCam(env *cfg.Cfg) frameGrabber {
	webcam := setupWebcam(env.Width, env.Height, env.Framerate)
	return func(dst *gocv.Mat) bool {
		ok := webcam.Read(dst)
		if !ok {
			return ok
		}
		util.T("convert-bw", func() {
			gocv.CvtColor(*dst, dst, gocv.ColorBGRToGray)
		})
		return ok
	}
}

func fromRaspi(env *cfg.Cfg, frames chan []byte) frameGrabber {
	return func(dst *gocv.Mat) bool {
		frame := <-frames
		var input gocv.Mat
		var err error
		util.T("new-mat", func() {
			input, err = gocv.NewMatFromBytes(env.Height, env.Width, gocv.MatTypeCV8U, frame)
		})

		*dst = input
		if err != nil {
			panic(err)
		}
		return true
	}
}

func simpleGauge(name string) prometheus.Gauge {
	g := prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      name,
	})
	prometheus.MustRegister(g)
	return g
}

func simpleCounter(name string) prometheus.Counter {
	c := prometheus.NewCounter(prometheus.CounterOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      name,
	})
	prometheus.MustRegister(c)
	return c
}

func Run() {
	env := &cfg.Cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	simpleGauge("width").Set(float64(env.Width))
	simpleGauge("height").Set(float64(env.Height))
	simpleGauge("pixel_count").Set(float64(env.Width * env.Height))
	simpleGauge("bit_rate").Set(float64(env.Bitrate))

	if env.RaspiStill {
		err = raspiStill(logger)
		if err != nil {
			logger.Warn("Error running raspistill", zap.Error(err))
		}
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
	logger.Info("listening", zap.Int("Port", env.Port))

	rec := recorder.NewRecorder(logger, env.RecorderBufsize, env.Outdir)

	// TODO: use standard_server
	mux := cmux.New(listener)
	httpListener := mux.Match(cmux.HTTP1Fast())
	grpcListener := mux.Match(cmux.Any())
	mux.HandleError(func(err error) bool {
		panic(err)
	})

	go serveGRPC(grpcListener, b, rec)
	go serveHTTP(wsBroker, httpListener, fmt.Sprintf("%d", env.Port))

	go func() {
		err := mux.Serve()
		if err != nil {
			panic(err)
		}
	}()

	var grabber frameGrabber

	if env.Filename != "" {
		logger.Info("streaming from file", zap.String("filename", env.Filename))
		frames, err := runFileStreamer(env.Filename, env.Width, env.Height, env.Framerate)
		if err != nil {
			panic(err)
		}
		grabber = fromRaspi(env, frames)
	} else {
		var extraArgs []string
		if env.Hflip {
			extraArgs = append(extraArgs, "-hf")
		}
		if env.Vflip {
			extraArgs = append(extraArgs, "-vf")
		}
		frames, err := runRaspiVid(logger, rec, env.Width, env.Height, env.Framerate, extraArgs...)
		if err == nil {
			fmt.Println("Using raspiVid")
			grabber = fromRaspi(env, frames)
		} else {
			fmt.Println("Falling back to gocv: ", err)
			grabber = fromWebCam(env)
		}
	}

	ff := ffmpeg.NewFfmpeg(env, logger, wsBroker)

	func() {
		m := gocv.NewMat()
		defer m.Close()
		for frameNo := 0; frameNo < warmupFrames; frameNo++ {
			grabber(&m) // handle !ok
		}
	}()

	go func() {
		motionCh := b.Subscribe()
		ticker := time.NewTicker(100 * time.Millisecond)
		var end time.Time
		var none time.Time

		for {
			select {
			case m := <-motionCh:
				_, ok := m.(*schema.MotionDetected)
				if ok {
					rec.Record()
					end = time.Now().Add(env.MotionShutoffDelay)
				}
			case now := <-ticker.C:
				if end != none {
					if now.After(end) {
						end = none
						logger.Info("stopping recorder after timeout")
						rec.Stop()
					}
				}
			}
		}
	}()

	md := motion_detector.NewMotionDetector(env)
	preScaled := gocv.NewMat()

	for {
		util.T("whole-frame", func() {
			var ok bool
			var frame gocv.Mat

			util.T("read-frame", func() {
				ok = grabber(&frame)
			})
			if !ok {
				logger.Warn("unable to read frame")
				return
			}
			defer frame.Close()

			util.T("prescale", func() {
				sz := frame.Size()
				width, height := sz[1], sz[0]
				scale := float64(env.PrescaleWidth) / float64(width)

				if scale > 1.0 {
					scale = 1.0
				}

				newWidth := int(scale * float64(width))
				newHeight := int(scale * float64(height))

				gocv.Resize(frame, &preScaled, image.Pt(newWidth, newHeight), 0, 0, gocv.InterpolationNearestNeighbor)
			})

			motion := md.Detect(env, preScaled)
			maxRecord := processMotion(env, b, motion)

			drawFrame, ok := md.GetFrame(env.DrawFrame)
			if !ok {
				panic(fmt.Errorf("unknown frame: %s", env.DrawFrame))
			}

			ff.Ffmpeg(drawFrame, maxRecord)

			util.FrameProcessed.Inc()
		})
	}
}

var motionDetected = prometheus.NewCounterVec(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera",
	Name:      "motion",
}, []string{
	"min_area",
})

func init() {
	prometheus.MustRegister(motionDetected)
}

func processMotion(
	env *cfg.Cfg,
	broker *broker.Broker,
	motion []*motion_detector.MotionRecord,
) *motion_detector.MotionRecord {
	maxArea := 0.0
	var maxRecord *motion_detector.MotionRecord

	for _, mr := range motion {
		if mr.Area < env.MotionMinArea {
			motionDetected.WithLabelValues("false").Add(mr.Area)
			continue
		}
		motionDetected.WithLabelValues("true").Add(mr.Area)
		if mr.Area > maxArea {
			maxArea = mr.Area
			maxRecord = mr
		}
	}

	if maxArea > 0 {
		half := env.Width / 2 // TODO: this shouldn't depend on env.Width but rather the image
		t := float64(maxRecord.X-half) / float64(half)
		pos2 := -int(fovScale * t)

		msg := &schema.MotionDetected{
			Position:   float64(pos2),
			CameraName: env.Instance,
		}

		broker.Publish(msg)
	}

	return maxRecord
}

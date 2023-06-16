package camera

import (
	_ "embed"
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/cacktopus/theheads/camera/face_detector"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/camera/motion_detector"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/camera/source"
	"github.com/cacktopus/theheads/camera/source/mjpeg/file"
	"github.com/cacktopus/theheads/camera/source/mjpeg/webcam"
	"github.com/cacktopus/theheads/camera/source/raspivid_recorder"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"google.golang.org/grpc"
	"image"
	"image/color"
	"io/ioutil"
	"math"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
	"time"
)

type cameraMetrics struct {
	frameProcessed prometheus.Counter
	brightness     prometheus.Gauge
	motionDetected *prometheus.CounterVec
}

type Camera struct {
	logger    *zap.Logger
	env       *cfg.Cfg
	registry  *prometheus.Registry
	grabber   source.FrameGrabber
	ff        *ffmpeg.Ffmpeg
	md        *motion_detector.MotionDetector
	broker    *broker.Broker
	rec       *recorder.Recorder
	preScaled gocv.Mat

	floodlight        *floodlight.Floodlight
	currentBrightness *atomic.Float64
	faceDetector      *face_detector.Detector
	cpuTimer          *util.CPUTimer
	metrics           cameraMetrics
	wsBroker          *broker.Broker
}

func NewCamera(
	logger *zap.Logger,
	env *cfg.Cfg,
	mainBroker *broker.Broker,
	floodlight *floodlight.Floodlight,
) *Camera {
	registry := metrics.NewRegistry()
	wsBroker := broker.NewBroker()

	c := &Camera{
		logger:            logger,
		env:               env,
		broker:            mainBroker,
		floodlight:        floodlight,
		currentBrightness: &atomic.Float64{},
		preScaled:         gocv.NewMat(),
		registry:          registry,
		cpuTimer:          util.NewCPUTimer(registry),
		wsBroker:          wsBroker,
		metrics: cameraMetrics{
			frameProcessed: metrics.SimpleGauge(registry, "camera", "frame_processed"),
			brightness:     metrics.SimpleGauge(registry, "camera", "mean_brightness"),
			motionDetected: prometheus.NewCounterVec(prometheus.CounterOpts{
				Namespace: "heads",
				Subsystem: "camera",
				Name:      "motion",
			}, []string{
				"min_area",
			}),
		},
	}

	registry.MustRegister(c.metrics.motionDetected)
	metrics.SimpleGauge(c.registry, "camera", "width").Set(float64(c.env.Width))
	metrics.SimpleGauge(c.registry, "camera", "height").Set(float64(c.env.Height))
	metrics.SimpleGauge(c.registry, "camera", "pixel_count").Set(float64(c.env.Width * c.env.Height))
	metrics.SimpleGauge(c.registry, "camera", "bit_rate").Set(float64(c.env.BitrateKB))

	promauto.With(c.registry).NewCounterFunc(prometheus.CounterOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      "ffmpeg_subscriptions",
	}, func() float64 {
		return float64(wsBroker.SubCount())
	})

	promauto.With(c.registry).NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      "floodlight_active",
	}, func() float64 {
		value, err := c.floodlight.Value()
		if err != nil {
			logger.Error("error reading floodlight status", zap.Error(err))
			return math.NaN()
		}
		if value {
			return 1.0
		} else {
			return 0.0
		}
	})

	c.faceDetector = face_detector.NewDetector(env, c.registry, c.onFaceDetect)

	return c
}

func (c *Camera) Setup() {
	setupCPUMonitoring(c.registry)

	if c.env.RaspiStill {
		err := raspiStill(c.logger)
		if err != nil {
			c.logger.Warn("Error running raspistill", zap.Error(err))
		}
	}

	go c.wsBroker.Start()

	err := c.setupSource()
	if err != nil {
		panic(err)
	}

	frameRecorder, _ := c.grabber.(recorder.FrameRecorder)
	if frameRecorder != nil {
		c.rec = recorder.NewRecorder(
			c.logger,
			c.registry,
			frameRecorder,
			os.ExpandEnv(c.env.Outdir),
			c.env.RecorderMaxSize,
		)
	}

	s, err := standard_server.NewServer(&standard_server.Config{
		Logger: c.logger,
		Port:   c.env.Port,
		GrpcSetup: func(s *grpc.Server) error {
			h := &handler{
				env:        c.env,
				logger:     c.logger,
				broker:     c.broker,
				floodlight: c.floodlight,
				camera:     c,
			}

			heads.RegisterCameraServer(s, h)
			heads.RegisterFloodlightServer(s, h)
			heads.RegisterEventsServer(s, h)
			heads.RegisterPingServer(s, h)
			heads.RegisterRecorderServer(s, h)
			return nil
		},
		Registry: c.registry,
		HttpSetup: func(engine *gin.Engine) error {
			setupRoutes(c.logger, c.env, c.wsBroker, engine)
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	go func() {
		panic(s.Run())
	}()

	c.ff = ffmpeg.NewFfmpeg(
		c.logger,
		c.env,
		c.registry,
		c.wsBroker,
	)

	c.md = motion_detector.NewMotionDetector(c.env, c.cpuTimer)
}

func (c *Camera) setupSource() error {
	c.logger.Info("camera source", zap.String("source", c.env.Source))
	var err error

	parts := strings.Split(c.env.Source, ":")
	sourceName := parts[0]
	args := parts[1:]

	switch sourceName {
	case "raspivid":
		c.grabber, err = source.NewRaspivid(c.logger, c.env)
	case "raspivid-recorder":
		c.grabber, err = raspivid_recorder.NewRaspividRecorder(c.logger, c.env)
	case "webcam":
		c.grabber, err = source.NewWebcam(c.env)
	case "file":
		c.grabber = source.NewFileStreamer(c.logger, c.env, args[0])
	case "mjpeg-file":
		c.grabber = file.NewMjpegFileStreamer(c.env)
	case "mjpeg-webcam":
		c.grabber, err = webcam.NewMjpegWebcam(c.logger, c.env)
	case "libcamera":
		c.grabber, err = source.NewLibcamera(c.logger, c.env)
	default:
		panic("unknown source:")
	}

	return err
}

func (c *Camera) Run() {
	c.logger.Info("running")

	if c.rec != nil {
		go func() {
			err := c.rec.Run()
			if err != nil {
				panic(err)
			}
		}()
		go c.runRecorder()
	}

	go c.publishBrightness()

	for {
		c.cpuTimer.T("whole-frame", func() {
			c.readFrame()
		})
	}
}

func (c *Camera) readFrame() {
	var err error
	frame := gocv.NewMat()
	defer frame.Close()

	c.cpuTimer.T("read-frame", func() {
		err = c.grabber.Grab(&frame)
	})
	switch err {
	case nil:
		// pass
	case source.ErrFrameReadFailed:
		c.logger.Warn("unable to read frame")
	default:
		panic(err)
	}

	c.cpuTimer.T("prescale", func() {
		sz := frame.Size()
		width, height := sz[1], sz[0]
		scale := float64(c.env.PrescaleWidth) / float64(width)

		if scale > 1.0 {
			scale = 1.0
		}

		newWidth := int(scale * float64(width))
		newHeight := int(scale * float64(height))

		gocv.Resize(frame, &c.preScaled, image.Pt(newWidth, newHeight), 0, 0, gocv.InterpolationNearestNeighbor)
	})

	c.cpuTimer.T("frame-stats", func() {
		mean := c.preScaled.Mean()
		brightness := mean.Val1
		c.metrics.brightness.Set(brightness)
		c.currentBrightness.Store(brightness)
	})

	motion := c.md.Detect(c.env, c.preScaled)
	maxRecord := c.processMotion(motion)

	if c.env.DetectFaces {
		c.faceDetector.DetectFaces(&c.preScaled)
	}

	if c.ff.HasWatchers() {
		drawFrameSrc, ok := c.md.GetFrame(c.env.DrawFrame)
		if !ok {
			panic(fmt.Errorf("unknown frame: %s", c.env.DrawFrame))
		}

		drawFrame := gocv.NewMat()
		defer drawFrame.Close()

		switch drawFrameSrc.Channels() {
		case 1:
			gocv.CvtColor(*drawFrameSrc, &drawFrame, gocv.ColorGrayToBGR)
		}

		c.drawOnFrame(&drawFrame, maxRecord)
		c.faceDetector.DrawFaces(&drawFrame)
		c.ff.Ffmpeg(&drawFrame)
	}

	c.metrics.frameProcessed.Inc()
}

func (c *Camera) runRecorder() {
	motionCh := c.broker.Subscribe()
	ticker := time.NewTicker(100 * time.Millisecond)
	var end time.Time
	var none time.Time

	for {
		select {
		case m := <-motionCh:
			_, ok := m.(*schema.MotionDetected)
			if ok {
				c.rec.Record()
				end = time.Now().Add(c.env.MotionShutoffDelay)
			}
		case now := <-ticker.C:
			if end != none {
				if now.After(end) {
					end = none
					c.logger.Debug("stopping recorder after timeout")
					c.rec.Stop()
				}
			}
		}
	}
}

func (c *Camera) processMotion(
	motion []*motion_detector.MotionRecord,
) *motion_detector.MotionRecord {
	maxArea := 0.0
	var maxRecord *motion_detector.MotionRecord

	for _, mr := range motion {
		if mr.ContourArea < c.env.MotionMinArea {
			c.metrics.motionDetected.WithLabelValues("false").Add(mr.ContourArea)
			continue
		}
		c.metrics.motionDetected.WithLabelValues("true").Add(mr.ContourArea)
		if mr.ContourArea > maxArea {
			maxArea = mr.ContourArea
			maxRecord = mr
		}
	}

	if maxArea > 0 {
		msg := &schema.MotionDetected{
			Position:   maxRecord.Bounds.Theta(c.env.FOV),
			CameraName: c.env.Instance,
		}

		c.broker.Publish(msg)
	}

	return maxRecord
}

func (c *Camera) drawOnFrame(
	frame *gocv.Mat,
	maxRecord *motion_detector.MotionRecord,
) {
	hasMotion := maxRecord != nil && maxRecord.ContourArea > 0

	switch frame.Channels() {
	case 1:
		gocv.CvtColor(*frame, frame, gocv.ColorGrayToBGR)
	case 3:
		// pass
	default:
		panic("unexpected number of channels")
	}

	if c.env.CenterLine {
		c.cpuTimer.T("center-line", func() {
			sz := frame.Size()
			x := sz[1]
			y := sz[0]
			gocv.Line(
				frame,
				image.Point{X: x/2 - 1, Y: 0},
				image.Point{X: x/2 - 1, Y: y},
				color.RGBA{B: 128, G: 128, R: 128, A: 128},
				2,
			)
		})
	}

	if c.env.DrawMotion {
		c.cpuTimer.T("draw-motion", func() {
			if maxRecord != nil && maxRecord.ContourArea > 0 {
				blue := color.RGBA{R: 64, G: 64, B: 128, A: 255}
				maxRecord.Bounds.Draw(frame, blue)
			}
		})
	}

	c.cpuTimer.T("put-text", func() {
		currentTime := time.Now().Format("2006-01-02 15:04:05")

		motion := " "
		if hasMotion {
			motion = "M"
		}

		status := fmt.Sprintf("[%s] %s", motion, currentTime)

		gocv.PutText(
			frame,
			status,
			image.Point{X: 13, Y: 23},
			gocv.FontHersheySimplex,
			0.5,
			color.RGBA{R: 32, G: 32, B: 32, A: 255},
			2,
		)

		gocv.PutText(
			frame,
			status,
			image.Point{X: 10, Y: 20},
			gocv.FontHersheySimplex,
			0.5,
			color.RGBA{R: 160, G: 160, B: 160, A: 255},
			2,
		)
	})
}

func (c *Camera) onFaceDetect(faces []*face_detector.Face, imgBytes []byte) {
	// sort by largest face area
	sort.Slice(faces, func(i, j int) bool {
		return faces[i].Bounds.Area() > faces[j].Bounds.Area()
	})

	face := faces[0]

	c.broker.Publish(&schema.FaceDetected{
		CameraName: c.env.Instance,
		Position:   face.Bounds.Theta(c.env.FOV),
		Area:       face.Bounds.Area(),
	})

	if c.env.WriteFacesPath != "" {
		go func() {
			facesPath := os.ExpandEnv(c.env.WriteFacesPath)
			now := time.Now()
			outdir := filepath.Join(facesPath, now.Format("2006-01-02"))

			err := os.MkdirAll(outdir, 0o750)
			if err != nil {
				c.logger.Error("error creating faces directory", zap.Error(err))
				return
			}

			outfile := filepath.Join(outdir, "face-"+now.Format("2006-01-02T15:04:05.000")+".jpg")
			err = ioutil.WriteFile(outfile, imgBytes, 0o600)
			if err != nil {
				c.logger.Error("error writing face", zap.Error(err))
				return
			}
		}()
	}
}

func setupCPUMonitoring(registry prometheus.Registerer) {
	mypid := os.Getpid()

	if runtime.GOOS == "linux" {
		promauto.With(registry).NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_user_jiffies",
		}, func() float64 {
			return cpumon.ParseProc(mypid, 13)
		})

		promauto.With(registry).NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_system_jiffies",
		}, func() float64 {
			return cpumon.ParseProc(mypid, 14)
		})

		promauto.With(registry).NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_hz",
		}, func() float64 {
			var a = cpumon.GetHz()
			return float64(a)
		})
	}
}

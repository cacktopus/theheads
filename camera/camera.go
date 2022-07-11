package camera

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/camera/motion_detector"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"google.golang.org/grpc"
	"image"
	"os"
	"time"
)

type Camera struct {
	logger           *zap.Logger
	env              *cfg.Cfg
	gMean            prometheus.Gauge
	grabber          frameGrabber
	ff               *ffmpeg.Ffmpeg
	md               *motion_detector.MotionDetector
	broker           *broker.Broker
	rec              *recorder.Recorder
	cvMotionDetected *prometheus.CounterVec
	preScaled        gocv.Mat
	floodlight       *floodlight.Floodlight
}

type Brightness struct {
	Brightness float64
}

func (b Brightness) Name() string {
	return "brightness"
}

func NewCamera(logger *zap.Logger, env *cfg.Cfg, broker *broker.Broker, floodlight *floodlight.Floodlight) *Camera {
	return &Camera{
		logger:     logger,
		env:        env,
		broker:     broker,
		floodlight: floodlight,
	}
}

func (c *Camera) Setup() {
	simpleGauge("width").Set(float64(c.env.Width))
	simpleGauge("height").Set(float64(c.env.Height))
	simpleGauge("pixel_count").Set(float64(c.env.Width * c.env.Height))
	simpleGauge("bit_rate").Set(float64(c.env.Bitrate))
	c.gMean = simpleGauge("mean_brightness")

	c.cvMotionDetected = prometheus.NewCounterVec(prometheus.CounterOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      "motion",
	}, []string{
		"min_area",
	})

	prometheus.MustRegister(c.cvMotionDetected)

	if c.env.RaspiStill {
		err := raspiStill(c.logger)
		if err != nil {
			c.logger.Warn("Error running raspistill", zap.Error(err))
		}
	}

	wsBroker := broker.NewBroker()
	go wsBroker.Start()

	promauto.NewCounterFunc(prometheus.CounterOpts{
		Name: "heads_camera_ffmpeg_subscriptions",
	}, func() float64 {
		return float64(wsBroker.SubCount())
	})

	c.rec = recorder.NewRecorder(
		c.logger,
		c.env.RecorderBufsize,
		os.ExpandEnv(c.env.Outdir),
		c.env.RecorderMaxSize,
	)

	s, err := standard_server.NewServer(&standard_server.Config{
		Logger: c.logger,
		Port:   c.env.Port,
		GrpcSetup: func(s *grpc.Server) error {
			h := &handler{
				logger: c.logger,
				broker: c.broker,
				rec:    c.rec,
			}

			gen.RegisterCameraServer(s, h)
			return nil
		},
		HttpSetup: func(engine *gin.Engine) error {
			setupRoutes(c.logger, wsBroker, engine)
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	go func() {
		panic(s.Run())
	}()

	if c.env.Filename != "" {
		c.logger.Info("streaming from file", zap.String("filename", c.env.Filename))
		frames, err := runFileStreamer(c.env.Filename, c.env.Width, c.env.Height, c.env.Framerate)
		if err != nil {
			panic(err)
		}
		c.grabber = fromRaspi(c.env, frames)
	} else {
		var extraArgs []string
		extraArgs = append(extraArgs, c.env.RaspividExtraArgs...)

		if c.env.Hflip {
			extraArgs = append(extraArgs, "-hf")
		}
		if c.env.Vflip {
			extraArgs = append(extraArgs, "-vf")
		}
		frames, err := runRaspiVid(c.logger, c.rec, c.env.Width, c.env.Height, c.env.Framerate, extraArgs...)
		if err == nil {
			c.logger.Info("camera source", zap.String("source", "raspivid"))
			c.grabber = fromRaspi(c.env, frames)
		} else {
			c.logger.Warn("falling back to gocv", zap.Error(err))
			c.logger.Info("camera source", zap.String("source", "gocv"))
			c.grabber = fromWebCam(c.env)
		}
	}

	c.ff = ffmpeg.NewFfmpeg(c.env, c.logger, wsBroker)
	c.md = motion_detector.NewMotionDetector(c.env)
}

func (c *Camera) Run() {
	go c.runRecorder()

	c.preScaled = gocv.NewMat()

	func() {
		m := gocv.NewMat()
		defer m.Close()
		for frameNo := 0; frameNo < warmupFrames; frameNo++ {
			c.grabber(&m) // handle !ok
		}
	}()

	for {
		util.T("whole-frame", func() {
			c.readFrame()
		})
	}
}

func (c *Camera) readFrame() {
	var ok bool
	var frame gocv.Mat

	util.T("read-frame", func() {
		ok = c.grabber(&frame)
	})
	if !ok {
		c.logger.Warn("unable to read frame")
		return
	}
	defer frame.Close()

	util.T("prescale", func() {
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

	util.T("frame-stats", func() {
		mean := c.preScaled.Mean()
		brightness := mean.Val1
		c.gMean.Set(brightness)
		c.broker.Publish(&Brightness{Brightness: brightness})
	})

	motion := c.md.Detect(c.env, c.preScaled)
	maxRecord := c.processMotion(motion)

	drawFrame, ok := c.md.GetFrame(c.env.DrawFrame)
	if !ok {
		panic(fmt.Errorf("unknown frame: %s", c.env.DrawFrame))
	}

	hasMotion := maxRecord != nil && maxRecord.Area > 0
	c.ff.Ffmpeg(
		drawFrame,
		maxRecord,
		c.rec.IsRecording(),
		hasMotion,
	)

	util.FrameProcessed.Inc()
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
		if mr.Area < c.env.MotionMinArea {
			c.cvMotionDetected.WithLabelValues("false").Add(mr.Area)
			continue
		}
		c.cvMotionDetected.WithLabelValues("true").Add(mr.Area)
		if mr.Area > maxArea {
			maxArea = mr.Area
			maxRecord = mr
		}
	}

	if maxArea > 0 {
		half := maxRecord.FrameWidth / 2
		t := float64(maxRecord.X-half) / float64(half)
		pos2 := -int(fovScale * t)

		msg := &schema.MotionDetected{
			Position:   float64(pos2),
			CameraName: c.env.Instance,
		}

		c.broker.Publish(msg)
	}

	return maxRecord
}

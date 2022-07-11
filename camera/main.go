package camera

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
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

	msgBroker := broker.NewBroker()
	go msgBroker.Start()

	errCh := make(chan error)
	go func() {
		panic(<-errCh)
	}()

	var fl *floodlight.Floodlight
	if env.Floodlight.Pin >= 0 {
		fl = floodlight.NewFloodlight(env.Floodlight.Pin)
		err = fl.Setup()
		if err != nil {
			panic(err)
		}
	}

	c := NewCamera(
		logger,
		env,
		msgBroker,
		fl,
	)
	c.Setup()
	c.Run()
}

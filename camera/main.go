package camera

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/util"
	"go.uber.org/zap"
)

func Run(env *cfg.Cfg) {
	logger, err := util.NewLogger(false)
	if err != nil {
		panic(err)
	}

	msgBroker := broker.NewBroker()
	go msgBroker.Start()

	errCh := make(chan error)
	go func() {
		panic(<-errCh)
	}()

	fl := floodlight.NewFloodlight(env.FloodlightPin)
	err = fl.Setup()
	if err != nil {
		logger.Error("error setting up floodlight", zap.Error(err))
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

package main

import (
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/cacktopus/theheads/timesync/cfg"
	"github.com/cacktopus/theheads/timesync/rtc"
	"github.com/cacktopus/theheads/timesync/rtc/ds3231"
	"github.com/cacktopus/theheads/timesync/server"
	"github.com/cacktopus/theheads/timesync/sync"
	"github.com/cacktopus/theheads/timesync/util"
	"github.com/coreos/go-systemd/daemon"
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"os"
	"time"
)

var opt struct {
	SetRTCTime bool `long:"set-rtc-time" optional:"true"`
}

func run(logger *zap.Logger, env *cfg.Config, discovery discovery.Discovery) {
	if env.MinSources < 1 {
		panic("MIN_SOURCES must be greater than zero")
	}

	go func() {
		sync.Synctime(env, logger, discovery, true)
		logger.Info("notifying systemd")
		_, err := daemon.SdNotify(true, daemon.SdNotifyReady)
		if err != nil {
			logger.Warn("systemd notify failed", zap.Error(err))
		}
		for range time.NewTicker(env.Interval).C {
			sync.Synctime(env, logger, discovery, false)
		}
	}()

	h := &server.Handler{
		RTC: env.RTC,
	}

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   env.Port,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterTimeServer(grpcServer, h)
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	err = server.Run()
	if err != nil {
		panic(err)
	}
}

func readRTCTime(rtc *ds3231.Device, logger *zap.Logger) *time.Time {
	if rtc == nil {
		logger.Warn("no rtc available")
		return nil
	}

	t, err := rtc.ReadTime()
	if err != nil {
		logger.Warn("error reading rtc time", zap.Error(err))
		return nil
	}

	logger.Info(
		"read rtc time",
		zap.String("rtc_time", t.UTC().String()),
		zap.String("system_time", time.Now().In(time.UTC).String()),
	)

	return &t
}

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}
	logger.Info("starting")

	env := &cfg.Config{}
	err = envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	_, err = flags.ParseArgs(&opt, os.Args[1:])
	if err != nil {
		panic(err)
	}

	rtClock, err := rtc.SetupI2C()
	if err != nil {
		logger.Warn("error setting up i2c", zap.Error(err))
	}

	rtt := readRTCTime(rtClock, logger)
	if opt.SetRTCTime {
		if rtt != nil {
			err := util.SetTime(util.TimeToFloat64(*rtt))
			if err != nil {
				panic(errors.Wrap(err, "set time")) // TODO
			}
		}
		return
	}

	run(logger, env, discovery.MDNSDiscovery{})
}

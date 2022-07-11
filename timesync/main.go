package timesync

import (
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/retry"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/cacktopus/theheads/timesync/cfg"
	"github.com/cacktopus/theheads/timesync/rtc"
	"github.com/cacktopus/theheads/timesync/rtc/ds3231"
	"github.com/cacktopus/theheads/timesync/server"
	"github.com/cacktopus/theheads/timesync/sync"
	"github.com/coreos/go-systemd/daemon"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"time"
)

func run(logger *zap.Logger, env *cfg.Config, discovery discovery.Discovery) {
	if env.MinSources < 1 {
		panic("MIN_SOURCES must be greater than zero")
	}

	go func() {
		err := retry.Retry(5, 2*time.Second, func(attempt int) error {
			err := sync.Synctime(env, logger, discovery, true)
			if err != nil {
				logger.Debug("fast sync error", zap.Int("attempt", attempt), zap.Error(err))
			}
			return err
		})
		if err != nil {
			logger.Error("fast sync failed", zap.Error(err))
		} else {
			// raise the logging level if we get a successful sync
			logger = logger.WithOptions(zap.IncreaseLevel(zap.InfoLevel))
		}
		logger.Info("notifying systemd")
		_, err = daemon.SdNotify(true, daemon.SdNotifyReady)
		if err != nil {
			logger.Warn("systemd notify failed", zap.Error(err))
		}
		for range time.NewTicker(env.Interval).C {
			err = sync.Synctime(env, logger, discovery, false)
			if err != nil {
				logger.Debug("sync error")
			} else {
				// raise the logging level if we get a successful sync
				logger = logger.WithOptions(zap.IncreaseLevel(zap.InfoLevel))
			}
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

func readRTCTime(rtc *ds3231.Device, logger *zap.Logger) bool {
	if rtc == nil {
		logger.Debug("no rtc available")
		return false
	}

	t, err := rtc.ReadTime()
	if err != nil {
		logger.Debug("error reading rtc time", zap.Error(err))
		return false
	}

	now := time.Now().In(time.UTC)

	dt := now.Sub(t)
	if dt < 0 {
		dt = -dt
	}

	correct := dt < 5*time.Second

	logger.Debug(
		"read rtc time",
		zap.String("rtc_time", t.UTC().String()),
		zap.String("system_time", now.String()),
		zap.Bool("correct", correct),
	)

	return correct
}

func Run(discover discovery.Discovery) {
	logConfig := zap.NewProductionConfig()
	logConfig.Level = zap.NewAtomicLevelAt(zap.DebugLevel)

	logger, err := logConfig.Build()
	if err != nil {
		panic(err)
	}
	logger.Debug("starting")

	env := &cfg.Config{}
	err = envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	rtClock, err := rtc.SetupI2C()
	if err != nil {
		logger.Warn("error setting up i2c", zap.Error(err))
	}

	correct := readRTCTime(rtClock, logger)
	if correct {
		logger = logger.WithOptions(zap.IncreaseLevel(zap.InfoLevel))
	}

	run(logger, env, discover)
}

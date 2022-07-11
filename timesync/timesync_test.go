package timesync

import (
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/timesync/cfg"
	"go.uber.org/zap"
	"testing"
	"time"
)

func Test_sync(t *testing.T) {
	logger, _ := zap.NewProduction()
	services := &discovery.StaticDiscovery{}

	c1 := &cfg.Config{
		Port:       util.RandomPort(),
		RTC:        true,
		Interval:   5 * time.Second,
		MinSources: 1,
	}
	c2 := &cfg.Config{
		Port:       util.RandomPort(),
		RTC:        true,
		Interval:   6 * time.Second,
		MinSources: 1,
	}
	c3 := &cfg.Config{
		Port:       util.RandomPort(),
		RTC:        false,
		Interval:   7 * time.Second,
		MinSources: 1,
	}

	go run(logger, c1, services)
	go run(logger, c2, services)
	go run(logger, c3, services)

	time.Sleep(200 * time.Millisecond)

	services.Register("timesync", "timesync-01", c1.Port)
	services.Register("timesync", "timesync-02", c2.Port)
	services.Register("timesync", "timesync-03", c3.Port)

	select {}
}

package main

import (
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"testing"
	"time"
)

func Test_sync(t *testing.T) {
	services := discovery.NewStaticDiscovery()

	c1 := &cfg{
		Port:     util.RandomPort(),
		RTC:      true,
		Interval: 5 * time.Second,
	}
	c2 := &cfg{
		Port:     util.RandomPort(),
		RTC:      true,
		Interval: 6 * time.Second,
	}
	c3 := &cfg{
		Port:     util.RandomPort(),
		RTC:      false,
		Interval: 7 * time.Second,
	}

	go run(c1, services)
	go run(c2, services)
	go run(c3, services)

	time.Sleep(200 * time.Millisecond)

	services.Register("_timesync._tcp", "timesync-01", c1.Port)
	services.Register("_timesync._tcp", "timesync-02", c2.Port)
	services.Register("_timesync._tcp", "timesync-03", c3.Port)

	go services.Run()

	select {}
}

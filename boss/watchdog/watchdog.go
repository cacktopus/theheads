package watchdog

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

var (
	lastUpdated time.Time
	feedCh      = make(chan bool)

	watchdogFed = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_boss_watchdog_fed",
	})
)

const (
	timeout       = 2 * time.Minute
	checkInterval = 5 * time.Second
)

func init() {
	lastUpdated = time.Now()
}

func Feed() {
	feedCh <- true
}

func check() {
	expiry := lastUpdated.Add(timeout)
	if time.Now().After(expiry) {
		logrus.Error("Watchdog timed out")
		os.Exit(-10)
	}
}

func Watch() {
	ticker := time.NewTicker(checkInterval)
	for {
		select {
		case <-feedCh:
			watchdogFed.Inc()
			lastUpdated = time.Now()
		case <-ticker.C:
			check()
		}
	}
}

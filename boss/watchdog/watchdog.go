package watchdog

import (
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

var lastUpdated time.Time
var feedCh = make(chan bool)

const (
	//timeout       = 2 * time.Minute
	timeout       = 20 * time.Second
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
			lastUpdated = time.Now()
		case <-ticker.C:
			check()
		}
	}
}

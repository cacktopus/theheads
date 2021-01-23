package boss

import (
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"time"
)

func Idle(dj *DJ, done util.BroadcastCloser, entry *logrus.Entry) {
	for {
		watchdog.Feed()

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

package boss

import (
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"go.uber.org/zap"
	"time"
)

func Idle(dj *DJ, done util.BroadcastCloser, logger *zap.Logger) {
	for {
		watchdog.Feed()

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

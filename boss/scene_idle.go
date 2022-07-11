package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"go.uber.org/zap"
	"time"
)

func Idle(
	ctx context.Context,
	dj *DJ,
	done util.BroadcastCloser,
	logger *zap.Logger,
) {
	for {
		watchdog.Feed()

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

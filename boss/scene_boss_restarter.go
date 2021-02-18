package boss

import (
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/util"
	"go.uber.org/zap"
	"os"
	"time"
)

func BossRestarter(dj *DJ, done util.BroadcastCloser, logger *zap.Logger) {
	rate_limiter.Limit("boss.restart", time.Hour, func() {
		os.Exit(0)
	})

	done.Close()
}

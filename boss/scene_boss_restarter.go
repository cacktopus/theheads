package boss

import (
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

func BossRestarter(dj *DJ, done util.BroadcastCloser, entry *logrus.Entry) {
	rate_limiter.Limit("boss.restart", time.Hour, func() {
		os.Exit(0)
	})

	done.Close()
}

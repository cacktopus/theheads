package main

import (
	"github.com/cacktopus/heads/boss/rate_limiter"
	"github.com/cacktopus/heads/boss/util"
	"os"
	"time"
)

func BossRestarter(dj *DJ, done util.BroadcastCloser) {
	rate_limiter.Limit("boss.restart", time.Hour, func() {
		os.Exit(0)
	})

	done.Close()
}

package main

import (
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"time"
)

func Idle(dj *DJ, done util.BroadcastCloser) {
	for {
		watchdog.Feed()

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

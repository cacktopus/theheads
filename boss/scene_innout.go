package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/util"
	"github.com/cacktopus/heads/boss/watchdog"
	"time"
)

func InNOut(dj *DJ, done util.BroadcastCloser) {
	center := geom.ZeroVec()

	for _, h := range dj.scene.Heads {
		center = center.Add(h.M.Translation())
	}

	center = center.Scale(1.0 / float64(len(dj.scene.Heads)))

	for {
		watchdog.Feed()

		for _, head := range dj.scene.Heads {
			theta := head.PointAwayFrom(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}

		for _, head := range dj.scene.Heads {
			theta := head.PointTo(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

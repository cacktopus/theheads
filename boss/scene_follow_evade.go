package main

import (
	"fmt"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"time"
)

const (
	trackingPeriod = 40 * time.Millisecond
)

func FollowClosestFocalPoint(
	dj *DJ,
	done util.BroadcastCloser,
	head *scene.Head,
	evadeDistance float64,
) {
	for {
		select {
		case <-time.After(trackingPeriod):
			p := head.GlobalPos()

			selected, distance := dj.grid.ClosestFocalPointTo(p)
			if selected == nil {
				continue
			}

			var theta float64
			if distance < evadeDistance {
				theta = head.PointAwayFrom(selected.Pos)
			} else {
				theta = head.PointTo(selected.Pos)
			}

			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		case <-done.Chan():
			logrus.WithField("head", head.Name).Info("Finishing FollowClosestFocalPoint")
			return
		}
	}
}

func FollowEvade(dj *DJ, done util.BroadcastCloser) {
	for _, head := range dj.scene.Heads {
		go FollowClosestFocalPoint(dj, done, head, -1.0)
	}

	t := time.NewTicker(5 * time.Second)

loop:
	for {
		select {
		case <-t.C:
			watchdog.Feed()
		case <-done.Chan():
			break loop
		}
	}

	logrus.Info("Finishing FollowEvade")
}

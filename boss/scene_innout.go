package boss

import (
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"time"
)

func InNOut(dj *DJ, done util.BroadcastCloser, logger *logrus.Entry) {
	center := geom.ZeroVec()

	for _, h := range dj.scene.Heads {
		center = center.Add(h.M.Translation())
	}

	center = center.Scale(1.0 / float64(len(dj.scene.Heads)))

	for {
		watchdog.Feed()

		for _, head := range dj.scene.Heads {
			theta := head.PointAwayFrom(center)
			_, err := dj.headManager.Position("head", theta)
			if err != nil {
				logger.WithError(err).Error("error positioning")
			}
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}

		for _, head := range dj.scene.Heads {
			theta := head.PointTo(center)
			_, err := dj.headManager.Position("head", theta)
			if err != nil {
				logger.WithError(err).Error("error positioning")
			}
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

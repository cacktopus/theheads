package boss

import (
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"go.uber.org/zap"
	"time"
)

func InNOut(dj *DJ, done util.BroadcastCloser, logger *zap.Logger) {
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
				logger.Error("error positioning", zap.Error(err))
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
				logger.Error("error positioning", zap.Error(err))
			}
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

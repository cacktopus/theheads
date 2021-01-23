package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
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
	logger := logrus.WithField("head", head.Name)

loop:
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

			conn, err := dj.headManager.GetHeadConn(head.Name)
			if err != nil {
				logger.WithError(err).Error("error getting head conn")
				continue loop
			}

			if _, err = gen.NewHeadClient(conn).Rotation(context.Background(), &gen.RotationIn{
				Theta: theta,
			}); err != nil {
				logger.WithError(err).Error("error setting rotation")
				continue loop
			}
		case <-done.Chan():
			logger.Info("Finishing FollowClosestFocalPoint")
			return
		}
	}
}

func FollowEvade(dj *DJ, done util.BroadcastCloser, entry *logrus.Entry) {
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

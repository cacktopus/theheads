package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"time"
)

const (
	trackingPeriod = 40 * time.Millisecond
)

func FollowClosestFocalPoint(
	ctx context.Context,
	logger *zap.Logger,
	dj *DJ,
	done util.BroadcastCloser,
	head *scene.Head,
	evadeDistance float64,
) {
	if _, err := dj.headManager.SetActor(ctx, head.Name, "Seeker"); err != nil {
		logger.Error("error setting actor", zap.Error(err))
		return
	}

	ticker := time.NewTicker(trackingPeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			err := followSingleHeadOnce(ctx, dj, head, evadeDistance)
			if err != nil {
				logger.Error("error following head", zap.Error(err))
			}
		case <-done.Chan():
			logger.Info("Finishing FollowClosestFocalPoint")
			return
		}
	}
}

func followSingleHeadOnce(
	ctx context.Context,
	dj *DJ,
	head *scene.Head,
	evadeDistance float64,
) error {
	p := head.GlobalPos()

	selected, distance := dj.grid.ClosestFocalPointTo(p)
	if selected == nil {
		return nil
	}

	var theta float64
	if distance < evadeDistance {
		theta = head.PointAwayFrom(geom.NewVec(selected.Pos.X, selected.Pos.Y))
	} else {
		theta = head.PointTo(geom.NewVec(selected.Pos.X, selected.Pos.Y))
	}

	if _, err := dj.headManager.SetTarget(ctx, head.Name, theta); err != nil {
		return errors.Wrap(err, "set target")
	}

	return nil
}

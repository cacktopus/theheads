package scenes

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/common/geom"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"math/rand"
	"time"
)

const (
	trackingPeriod = 40 * time.Millisecond
)

type Tracker func(sp *dj.SceneParams, head *scene.Head) error

func Track(
	sp *dj.SceneParams,
	head *scene.Head,
	initialHeadActor string,
	tracker Tracker,
) {
	if _, err := sp.DJ.HeadManager.SetActor(sp.Ctx, head.URI(), initialHeadActor); err != nil {
		sp.Logger.Error("error setting actor", zap.Error(err))
		return
	}

	// so that all heads don't move at once
	delay := time.Duration(rand.Int63n(int64(trackingPeriod)))
	time.Sleep(delay)

	ticker := time.NewTicker(trackingPeriod)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			err := tracker(sp, head)
			if err != nil {
				sp.Logger.Error("error following head", zap.Error(err))
			}
		case <-sp.Done.Chan():
			sp.Logger.Debug("Finishing Track")
			return
		}
	}
}

func TrackClosestFocalPoint(
	sp *dj.SceneParams,
	head *scene.Head,
) error {
	p := head.GlobalPos()

	selected, _ := sp.DJ.Grid.ClosestFocalPointTo(p)
	if selected == nil {
		return nil
	}

	theta := head.PointTo(geom.NewVec(selected.Pos.X, selected.Pos.Y))

	if _, err := sp.DJ.HeadManager.SetTarget(sp.Ctx, head.URI(), theta); err != nil {
		return errors.Wrap(err, "set target")
	}

	return nil
}

func TrackEvadeFocalPoint(
	sp *dj.SceneParams,
	head *scene.Head,
) error {
	p := head.GlobalPos()

	selected, distance := sp.DJ.Grid.ClosestFocalPointTo(p)
	if selected == nil || distance < 0.01 {
		return nil
	}

	var theta float64
	if head.Fearful() {
		theta = head.PointAwayFrom(geom.NewVec(selected.Pos.X, selected.Pos.Y))
	} else {
		theta = head.PointTo(geom.NewVec(selected.Pos.X, selected.Pos.Y))
	}

	if _, err := sp.DJ.HeadManager.SetTarget(sp.Ctx, head.URI(), theta); err != nil {
		return errors.Wrap(err, "set target")
	}

	return nil
}

package boss

import (
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"math/rand"
	"time"
)

func TimeF(d float64) time.Duration {
	return time.Duration(d * float64(time.Second))
}

func PositionHead(dj *DJ, name string, theta float64) (time.Duration, error) {
	state, err := dj.headManager.Position(name, theta)

	if err != nil {
		logrus.WithError(err).Error("Error sending to head")
		return 0, err
	}

	return TimeF(state.Eta), nil
}

func Conversation(dj *DJ, done util.BroadcastCloser, logger *logrus.Entry) {
	t := scene.RandomText(dj.texts)

	pointHeads := func(h0, h1 *scene.Head) {
		t0 := h0.PointTo(h1.GlobalPos())

		logger.WithFields(logrus.Fields{
			"h0": h0.Name,
			"h1": h1.Name,
			"p0": h0.GlobalPos().AsStr(),
			"p1": h1.GlobalPos().AsStr(),
			"t0": t0,
		}).Info("selected head")

		eta0, _ := PositionHead(dj, h0.Name, t0)
		done0 := time.Now().Add(eta0)

		if stop := dj.Sleep(done, TimeF(0.33)); stop {
			return
		}

		t1 := h1.PointTo(h0.GlobalPos())
		eta1, _ := PositionHead(dj, h1.Name, t1)
		done1 := time.Now().Add(eta1)

		// ensure done1 is the greater time
		if done0.After(done1) {
			done0, done1 = done1, done0
		}

		delay := done1.Sub(time.Now()) + TimeF(0.20)

		logger.WithFields(logrus.Fields{
			"eta0":  eta0.Seconds(),
			"eta1":  eta1.Seconds(),
			"delay": delay.Seconds(),
		}).Info("etas")

		if stop := dj.Sleep(done, delay); stop {
			return
		}
	}

	sayPart := func(part scene.Content) {
		logger.WithField("part", part).Info("saying")

		heads := scene.ShuffledHeads(dj.scene.Heads)

		// all point forward
		for _, head := range dj.scene.Heads {
			theta := head.PointTo(geom.NewVec(0, -10))
			_, err := dj.headManager.Position("head", theta)
			if err != nil {
				logger.WithError(err).Error("error positioning")
			}
		}

		if stop := dj.Sleep(done, TimeF(1.5)); stop {
			return
		}

		h0 := heads[0]
		h1 := heads[1]

		p := h0.GlobalPos()
		selected, distance := dj.grid.ClosestFocalPointTo(p)

		if selected != nil && distance <= 5.0 && rand.Float64() < 0.66 {
			logger.WithFields(logrus.Fields{
				"h0":       h0.Name,
				"distance": distance,
			}).Info("talking to viewer")
			done2 := util.NewBroadcastCloser()
			go FollowClosestFocalPoint(dj, done2, h0, -1)
			defer done2.Close()
			if stop := dj.Sleep(done, TimeF(1.5)); stop {
				return
			}
		} else {
			logger.WithFields(logrus.Fields{
				"distance": distance,
				"h0":       h0.Name,
				"h1":       h1.Name,
			}).Info("talking to another head")
			pointHeads(h0, h1)
		}

		dj.headManager.Say(h0.Name, part.ID)

		voiceWaitTime := TimeF(0.5)

		if stop := dj.Sleep(done, voiceWaitTime); stop {
			return
		}

		watchdog.Feed()
	}

	for _, part := range t.Content {
		sayPart(part)
	}

	done.Close()
}

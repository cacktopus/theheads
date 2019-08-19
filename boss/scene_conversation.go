package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/cacktopus/heads/boss/util"
	"github.com/cacktopus/heads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"math/rand"
	"time"
)

func TimeF(d float64) time.Duration {
	return time.Duration(d * float64(time.Second))
}

type HeadResult struct {
	Result     string  `json:"result"`
	Position   float64 `json:"position"`
	Rotation   float64 `json:"rotation"`
	Controller string  `json:"controller"`
	StepsAway  int     `json:"steps_away"`
	Eta        float64 `json:"eta"`
}

func PositionHead(dj *DJ, name string, theta float64) (time.Duration, error) {
	path0 := fmt.Sprintf("/rotation/%f", theta)

	headResult := HeadResult{}
	res := dj.headManager.sendWithResult("head", name, path0, &headResult)
	if res.Err != nil {
		logrus.WithError(res.Err).Error("Error sending to head")
		return 0, res.Err
	}
	return TimeF(headResult.Eta), nil
}

func Conversation(dj *DJ, done util.BroadcastCloser) {
	t := randomText(dj.texts)

	pointHeads := func(h0, h1 *scene.Head) {
		t0 := h0.PointTo(h1.GlobalPos())

		logrus.WithFields(logrus.Fields{
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

		logrus.WithFields(logrus.Fields{
			"eta0":  eta0.Seconds(),
			"eta1":  eta1.Seconds(),
			"delay": delay.Seconds(),
		}).Info("etas")

		if stop := dj.Sleep(done, delay); stop {
			return
		}
	}

	sayPart := func(part Content) {
		logrus.WithField("part", part).Info("saying")

		heads := scene.ShuffledHeads(dj.scene.Heads)

		// all point forward
		for _, head := range dj.scene.Heads {
			theta := head.PointTo(geom.NewVec(0, -10))
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		}

		if stop := dj.Sleep(done, TimeF(1.5)); stop {
			return
		}

		h0 := heads[0]
		h1 := heads[1]

		p := h0.GlobalPos()
		selected, distance := dj.grid.ClosestFocalPointTo(p)

		if selected != nil && distance <= 5.0 && rand.Float64() < 0.66 {
			done2 := util.NewBroadcastCloser()
			go FollowClosestFocalPoint(dj, done2, h0, -1)
			defer done2.Close()
			if stop := dj.Sleep(done, TimeF(1.5)); stop {
				return
			}
		} else {
			pointHeads(h0, h1)
		}

		playPath := fmt.Sprintf("/play?sound=%s", part.ID)
		result := dj.headManager.sendWithResult("voices", h0.Name, playPath, nil)
		if result.Err != nil {
			logrus.WithError(result.Err).Error("error playing sound")
		}

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

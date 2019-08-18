package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/sirupsen/logrus"
	"time"
)

type DJ struct {
	grid        *Grid
	scene       *scene.Scene
	headManager *HeadManager
	texts       []*Text
}

func Conversation(dj *DJ, done chan bool) {
	t := randomText(dj.texts)

	for _, part := range t.Content {
		logrus.WithField("part", part).Info("saying")

		heads := scene.RandomHeads(dj.scene.Heads)

		// all point forward
		for _, head := range dj.scene.Heads {
			theta := head.PointTo(geom.NewVec(0, -10))
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path, nil)
		}

		if stop := dj.Sleep(done, 1500*time.Millisecond); stop {
			return
		}

		h0 := heads[0]
		h1 := heads[1]

		t0 := h0.PointTo(h1.GlobalPos())

		logrus.WithFields(logrus.Fields{
			"h0": h0.Name,
			"h1": h1.Name,
			"p0": h0.GlobalPos().AsStr(),
			"p1": h1.GlobalPos().AsStr(),
			"t0": t0,
		}).Info("selected head")

		path0 := fmt.Sprintf("/rotation/%f", t0)
		dj.headManager.send("head", h0.Name, path0, nil)

		if stop := dj.Sleep(done, 333*time.Millisecond); stop {
			return
		}

		t1 := h1.PointTo(h0.GlobalPos())
		path1 := fmt.Sprintf("/rotation/%f", t1)
		dj.headManager.send("head", h1.Name, path1, nil)

		if stop := dj.Sleep(done, 2500*time.Millisecond); stop {
			return
		}

		playPath := fmt.Sprintf("/play?sound=%s", part.ID)
		finished := make(chan error)
		dj.headManager.send("voices", h0.Name, playPath, finished)
		err := <-finished // TODO: timeout
		if err != nil {
			logrus.WithError(err).Error("error playing sound")
		}

		//TODO: longer depending on duration
		if stop := dj.Sleep(done, 500*time.Millisecond); stop {
			return
		}
	}

}

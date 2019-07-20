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
			head.PointTo(geom.NewVec(0, -10))
		}

		h0 := heads[0]
		h1 := heads[1]

		t0 := h0.PointTo(h1.GlobalPos())
		path0 := fmt.Sprintf("/rotation/%f", t0)
		dj.headManager.send("head", h0.Name, path0, nil)

		time.Sleep(500 * time.Millisecond)

		t1 := h1.PointTo(h0.GlobalPos())
		path1 := fmt.Sprintf("/rotation/%f", t1)
		dj.headManager.send("head", h0.Name, path1, nil)

		time.Sleep(500 * time.Millisecond)

		playPath := fmt.Sprintf("/play?sound=%s", part.ID)
		finished := make(chan error)
		dj.headManager.send("voices", h0.Name, playPath, finished)
		err := <-finished // TODO: timeout
		if err != nil {
			logrus.WithError(err).Error("error playing sound")
		}

		//TODO: longer depending on duration
		time.Sleep(500 * time.Millisecond)
	}

}

package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/cacktopus/heads/boss/util"
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

type SceneRunner func(dj *DJ, done util.BroadcastCloser)

type SceneConfig struct {
	Runner           SceneRunner
	MaxLengthSeconds uint
}

func FollowClosestFocalPoint(
	dj *DJ,
	done util.BroadcastCloser,
	head *scene.Head,
	wg *sync.WaitGroup,
	evadeDistance float64,
) {
	for {
		select {
		case <-time.After(40 * time.Millisecond):
			p := head.GlobalPos()

			selected, distance := dj.grid.ClosestFocalPointTo(p)
			if selected == nil {
				continue
			}

			var theta float64
			if distance < evadeDistance {
				theta = head.PointAwayFrom(selected.pos)
			} else {
				theta = head.PointTo(selected.pos)
			}

			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		case <-done.Chan():
			logrus.WithField("head", head.Name).Println("Finishing FollowClosestFocalPoint")
			wg.Done()
			return
		}
	}
}

func FollowEvade(dj *DJ, done util.BroadcastCloser) {
	var wg sync.WaitGroup
	for _, head := range dj.scene.Heads {
		wg.Add(1)
		go FollowClosestFocalPoint(dj, done, head, &wg, -1.0)
	}
	wg.Wait()
	logrus.Println("Finishing FollowEvade")
}

func InNOut(dj *DJ, done util.BroadcastCloser) {
	center := geom.ZeroVec()

	for _, h := range dj.scene.Heads {
		center = center.Add(h.M.Translation())
	}

	center = center.Scale(1.0 / float64(len(dj.scene.Heads)))

	for {
		for _, head := range dj.scene.Heads {
			theta := head.PointAwayFrom(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}

		for _, head := range dj.scene.Heads {
			theta := head.PointTo(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done.Chan():
			return
		}
	}
}

func (dj *DJ) RunScenes() {
	for {
		for _, sceneName := range dj.scene.Scenes {
			done := util.NewBroadcastCloser()
			sc := AllScenes[sceneName]
			go sc.Runner(dj, done)

			maxLength := time.Duration(sc.MaxLengthSeconds) * time.Second
			dj.Sleep(done, maxLength)
			done.Close()
		}
	}
}

func (dj *DJ) Sleep(done util.BroadcastCloser, duration time.Duration) bool {
	select {
	case <-time.After(duration):
		return false
	case <-done.Chan():
		return true
	}
}

var AllScenes = map[string]SceneConfig{
	"in_n_out":     {InNOut, 60},
	"follow_evade": {FollowEvade, 60},
	"conversation": {Conversation, 5 * 60},
}

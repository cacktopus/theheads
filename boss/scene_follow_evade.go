package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

func FollowClosestFocalPoint(
	dj *DJ,
	done chan bool,
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
			dj.headManager.send("head", head.Name, path, nil)
		case <-done:
			logrus.WithField("head", head.Name).Println("Finishing FollowClosestFocalPoint")
			wg.Done()
			return
		}
	}
}

func FollowEvade(dj *DJ, done chan bool) {
	var wg sync.WaitGroup
	for _, head := range dj.scene.Heads {
		wg.Add(1)
		go FollowClosestFocalPoint(dj, done, head, &wg, -1.0)
	}
	wg.Wait()
	logrus.Println("Finishing FollowEvade")
}

func InNOut(dj *DJ, done chan bool) {
	center := geom.ZeroVec()

	for _, h := range dj.scene.Heads {
		center = center.Add(h.M.Translation())
	}

	center = center.Scale(1.0 / float64(len(dj.scene.Heads)))

	for {
		for _, head := range dj.scene.Heads {
			theta := head.PointAwayFrom(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path, nil)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done:
			return
		}

		for _, head := range dj.scene.Heads {
			theta := head.PointTo(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			dj.headManager.send("head", head.Name, path, nil)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done:
			return
		}
	}
}

func (dj *DJ) RunScenes() {
	var done chan bool
	for {
		//done = make(chan bool)
		//go InNOut(dj, done)
		//time.Sleep(20 * time.Second)
		//close(done)
		//
		//done = make(chan bool)
		//go FollowEvade(dj, done)
		//time.Sleep(30 * time.Second)
		//close(done)
		Conversation(dj, done)
	}
}

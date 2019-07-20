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
	grid *Grid,
	headManager *HeadManager,
	head *scene.Head,
	done chan bool,
	wg *sync.WaitGroup,
	evadeDistance float64,
) {
	for {
		select {
		case <-time.After(40 * time.Millisecond):
			p := head.GlobalPos()

			selected, distance := grid.ClosestFocalPointTo(p)
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
			headManager.send("head", head.Name, path, nil)
		case <-done:
			logrus.WithField("head", head.Name).Println("Finishing FollowClosestFocalPoint")
			wg.Done()
			return
		}
	}
}

func FollowEvade(grid *Grid, scene *scene.Scene, headManager *HeadManager, done chan bool) {
	var wg sync.WaitGroup
	for _, head := range scene.Heads {
		wg.Add(1)
		go FollowClosestFocalPoint(grid, headManager, head, done, &wg, -1.0)
	}
	wg.Wait()
	logrus.Println("Finishing FollowEvade")
}

func InNOut(grid *Grid, scene *scene.Scene, headManager *HeadManager, done chan bool) {
	center := geom.ZeroVec()

	for _, h := range scene.Heads {
		center = center.Add(h.M.Translation())
	}

	center = center.Scale(1.0 / float64(len(scene.Heads)))

	for {
		for _, head := range scene.Heads {
			theta := head.PointAwayFrom(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			headManager.send("head", head.Name, path, nil)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done:
			return
		}

		for _, head := range scene.Heads {
			theta := head.PointTo(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			headManager.send("head", head.Name, path, nil)
		}

		select {
		case <-time.After(5 * time.Second):
		case <-done:
			return
		}
	}
}

func RunScenes(grid *Grid, scene *scene.Scene, headManager *HeadManager) {
	var done chan bool
	for {
		done = make(chan bool)
		go InNOut(grid, scene, headManager, done)
		time.Sleep(20 * time.Second)
		close(done)

		done = make(chan bool)
		go FollowEvade(grid, scene, headManager, done)
		time.Sleep(30 * time.Second)
		close(done)
	}
}

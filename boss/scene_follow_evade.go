package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"sync"
	"time"
)

func FollowClosestFocalPoint(
	grid *Grid,
	headManager *HeadManager,
	head *scene.Head,
	evadeDistance float64,
) {
	for {
		time.Sleep(40 * time.Millisecond)
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
	}
}

func FollowEvade(grid *Grid, scene *scene.Scene, headManager *HeadManager) {
	var wg sync.WaitGroup
	for _, head := range scene.Heads {
		wg.Add(1)
		go FollowClosestFocalPoint(grid, headManager, head, -1.0)
	}
	wg.Wait()
}

func InNOut(grid *Grid, scene *scene.Scene, headManager *HeadManager) {
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
		time.Sleep(5 * time.Second)

		for _, head := range scene.Heads {
			theta := head.PointTo(center)
			path := fmt.Sprintf("/rotation/%f", theta)
			headManager.send("head", head.Name, path, nil)
		}
		time.Sleep(5 * time.Second)
	}
}

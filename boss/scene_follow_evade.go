package main

import (
	"fmt"
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
		headManager.send("head", head.Name, path)
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

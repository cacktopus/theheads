package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/scene"
	"sync"
	"time"
)

func FollowClosestFocalPoint(
	head *scene.Head,
	grid *Grid,
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
		fmt.Println(path)
	}
}

func FollowEvade(grid *Grid, scene *scene.Scene) {
	var wg sync.WaitGroup
	for _, head := range scene.Heads {
		wg.Add(1)
		go FollowClosestFocalPoint(head, grid, 1.0)
	}
	wg.Wait()
}

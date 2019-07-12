package main

import "github.com/cacktopus/heads/boss/scene"

type grid struct {
	xmin, ymin, xmax, ymax float64
	imgsize_x, imgsize_y int,
	scene *scene.Scene
}

func NewGrid(
	xmin, ymin, xmax, ymax float64,
	imgsize_x, imgsize_y int,
	scene *scene.Scene,
) *grid {
	g := &grid{
		xmin: xmin, ymin:ymin, xmax: xmax, ymax: ymax,
		imgsize_x: imgsize_x, imgsize_y: imgsize_y,
		scene: scene,
	}

	return g
}

func (g *grid) TraceGrid(cameraName: str, ) {

}


func (g *grid) Start() {

}

func (g *grid) focus() {

}



func (g *grid) maybeSpawnFocalPoint() {

}




func (g *grid) backgroundProcessor() {

}


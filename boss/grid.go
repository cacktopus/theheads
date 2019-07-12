package main

import (
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"gonum.org/v1/gonum/mat"
	"math"
)

type Grid struct {
	minX, minY, maxX, maxY float64
	imgsizeX, imgsizeY     int
	scene                  *scene.Scene
	layers                 map[string]*mat.Dense
	scaleX, scaleY         float64
	/*
		self.xscale = self.img_size_x / (self.xmax - self.xmin)
		self.yscale = self.img_size_y / (self.xmax - self.xmin)
	*/
}

func NewGrid(
	minX, minY, maxX, maxY float64,
	imgsizeX, imgsizeY int,
	scene *scene.Scene,
) *Grid {
	g := &Grid{
		minX: minX, minY: minY, maxX: maxX, maxY: maxY,
		imgsizeX: imgsizeX, imgsizeY: imgsizeY,
		scene:  scene,
		layers: map[string]*mat.Dense{},
		scaleX: float64(imgsizeX) / (maxX - minX),
		scaleY: float64(imgsizeY) / (maxY - minY),
	}

	return g
}

// Returns the size of a Grid cell (in meters)
func (g *Grid) getPixelSize() (float64, float64) {
	x := (g.maxX - g.minX) / float64(g.imgsizeX)
	y := (g.maxY - g.minY) / float64(g.imgsizeY)

	return x, y
}

func (g *Grid) getLayer(cameraName string) *mat.Dense {
	layer, ok := g.layers[cameraName]
	if !ok {
		layer = mat.NewDense(g.imgsizeY, g.imgsizeY, nil)
		g.layers[cameraName] = layer
	}
	return layer
}

func (g *Grid) Trace(cameraName string, p0, p1 geom.Vec) {
	// TODO: trace focal points

	g.traceGrid(cameraName, p0, p1)
}

func (g *Grid) traceGrid(cameraName string, p0, p1 geom.Vec) {
	szX, szY := g.getPixelSize()
	stepSize := math.Min(szX, szY) / 4.0

	epsilon := stepSize / 2.0 // to avoid array out of bounds

	p0 = p0.Clamp(g.minX, g.minY, g.maxX-epsilon, g.maxY-epsilon)
	p1 = p1.Clamp(g.minX, g.minY, g.maxX-epsilon, g.maxY-epsilon)

	to := p1.Sub(p0)
	length := to.Abs()

	if length < stepSize {
		return
	}

	dX := to.X() * stepSize / length
	dY := to.Y() * stepSize / length

	posX, posY := p0.X(), p0.Y()

	steps := int(length / stepSize)

	data := g.getLayer(cameraName)

	g.traceSteps(data, posX, posY, dX, dY, steps, 0.025)
}

// this code is optimized for speed
func (g *Grid) traceSteps(layer *mat.Dense, posX, posY, dX, dY float64, steps int, incr float64) {
	// convert into "Grid coordinates"
	posX -= g.minX
	posY -= g.minY

	posX *= g.scaleX
	posY *= g.scaleY

	dX *= g.scaleX
	dY *= g.scaleY

	for i := 0; i < steps; i++ {
		yidx := int(math.Floor(posX)) // notice swap
		xidx := int(math.Floor(posY)) // notice swap

		value := layer.At(xidx, yidx) + 0.025
		layer.Set(xidx, yidx, value)
	}
}

/*
 for i in range(steps):
        #     yidx = int(math.floor(pos_x))  # notice swap
        #     xidx = int(math.floor(pos_y))  # notice swap
        #
        #     g[(xidx, yidx)] += 0.025
        #
        #     pos_x += dx
        #     pos_y += dy
*/

func (g *Grid) Start() {

}

func (g *Grid) focus() {

}

func (g *Grid) maybeSpawnFocalPoint() {

}

func (g *Grid) backgroundProcessor() {

}

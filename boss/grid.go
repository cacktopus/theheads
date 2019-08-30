package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/sirupsen/logrus"
	"gonum.org/v1/gonum/mat"
	"math"
	"strings"
	"time"
)

const (
	maxFloat = 1e99
	fpRadius = 0.8
)

var idCounter int // TODO: atomic, etc

func assignID() string {
	result := idCounter
	idCounter++
	return fmt.Sprintf("g%d", result)
}

func argmax(l *mat.Dense) (int, int, float64) {
	result := mat.DenseCopyOf(l)
	var maxI, maxJ int
	maxV := -1E-99
	result.Apply(func(i, j int, v float64) float64 {
		if v > maxV {
			maxI, maxJ = i, j
			maxV = v
		}
		return v
	}, l)
	return maxI, maxJ, maxV
}

type Grid struct {
	minX, minY, maxX, maxY float64
	imgsizeX, imgsizeY     int
	scaleX, scaleY         float64
	layers                 map[string]*mat.Dense
	focalPoints            map[string]*FocalPoint
	scene                  *scene.Scene
	broker                 *broker.Broker
}

func NewGrid(
	minX, minY, maxX, maxY float64,
	imgsizeX, imgsizeY int,
	scene *scene.Scene,
	broker *broker.Broker,
) *Grid {
	g := &Grid{
		minX: minX, minY: minY, maxX: maxX, maxY: maxY,
		imgsizeX: imgsizeX, imgsizeY: imgsizeY,
		scene:       scene,
		scaleX:      float64(imgsizeX) / (maxX - minX),
		scaleY:      float64(imgsizeY) / (maxY - minY),
		layers:      map[string]*mat.Dense{},
		focalPoints: map[string]*FocalPoint{},
		broker:      broker,
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
	hit := g.traceFocalPoints(p0, p1)

	if !hit {
		g.traceGrid(cameraName, p0, p1)
	}
	g.publishFocalPoints()
}

func (g *Grid) traceFocalPoints(p0, p1 geom.Vec) bool {
	minDist := maxFloat
	var minFp *FocalPoint
	var m0, m1 geom.Vec

	for _, fp := range g.focalPoints {
		q0, q1, hit := fp.lineIntersection(p0, p1)
		if hit {
			d := q0.Sub(p0).AbsSq()
			if d < minDist {
				m0, m1 = q0, q1
				minDist = d
				minFp = fp
			}
		}
	}

	// only interact with closest fp
	if minFp != nil {
		midpoint := m0.Add(m1.Sub(m0).Scale(0.5))
		to := midpoint.Sub(minFp.pos)
		minFp.pos = minFp.pos.Add(to.Scale(g.scene.CameraSensitivity))
		minFp.refresh()
		return true
	}

	return false
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

	layer := g.getLayer(cameraName)

	g.traceSteps(layer, posX, posY, dX, dY, steps, 0.025)
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

		posX += dX
		posY += dY
	}
}

func (g *Grid) Start() {
	time.Sleep(1000 * time.Millisecond)
	for {
		time.Sleep(250 * time.Millisecond)
		g.maybeSpawnFocalPoint()
		g.mergeOverlappingFocalPoints()
		g.decay()
		g.cleanupStale()
	}
}

func (g *Grid) mergeOverlappingFocalPoints() {
	// this runs every update and we can tolerate some overlap, so to keep things simple,
	// if we find a single overlap just deal with it and get to any other overlaps on the
	// next run

	for _, fp0 := range g.focalPoints {
		for id, fp1 := range g.focalPoints {
			if fp0 == fp1 {
				continue
			}
			if fp0.overlaps(fp1) {
				// midpoint = (fp0.pos + fp1.pos).scale(0.5
				midpoint := fp0.pos.Add(fp1.pos).Scale(0.5)
				fp0.pos = midpoint
				delete(g.focalPoints, id)
			}
		}
	}
}

func (g *Grid) decay() {
	g.layersWithPrefix("camera-", func(name string, layer *mat.Dense) {
		layer.Scale(0.75, layer)
	})
}

func (g *Grid) layersWithPrefix(prefix string, cb func(name string, layer *mat.Dense)) {
	for name, layer := range g.layers {
		if strings.HasPrefix(name, "camera-") {
			cb(name, layer)
		}
	}
}

func (g *Grid) cameraLayers() []*mat.Dense {
	var result []*mat.Dense
	g.layersWithPrefix("camera-", func(name string, layer *mat.Dense) {
		result = append(result, layer)
	})
	return result
}

func (g *Grid) newLayer() *mat.Dense {
	return mat.NewDense(g.imgsizeY, g.imgsizeX, nil)
}

func (g *Grid) combined() *mat.Dense {
	var cameraLayers = g.cameraLayers()

	if len(cameraLayers) == 0 {
		return g.newLayer()
	}

	// TODO: perhaps need some locking here
	masking := g.getLayer("__masking__")
	mask := g.getLayer("__mask__")
	sum := g.getLayer("__sum__")
	sum.Zero()

	for _, layer := range cameraLayers {
		masking.Apply(func(i, j int, v float64) float64 {
			if v > 0.01 {
				return 1.0
			}
			return 0.0
		}, layer)
		mask.Add(mask, masking)
		sum.Add(sum, layer)
	}

	mask.Apply(func(i, j int, v float64) float64 {
		if v > 1.0 {
			return 1.0
		}
		return 0
	}, mask)

	result := g.newLayer()
	result.MulElem(sum, mask)
	return result
}

func (g *Grid) idxToVec(i, j int) geom.Vec {
	szX, szY := g.getPixelSize()

	x := g.minX + szX*(float64(j)+0.5)
	y := g.minY + szY*(float64(i)+0.5)

	return geom.NewVec(x, y)
}

func (g *Grid) focus() (geom.Vec, float64) {
	layer := g.combined()
	i, j, v := argmax(layer)
	return g.idxToVec(i, j), v
}

func (g *Grid) maybeSpawnFocalPoint() {
	p, val := g.focus()
	if val < 0.10 {
		return
	}

	newFp := NewFocalPoint(p, fpRadius, "", DefaultTTL)

	for _, fp := range g.focalPoints {
		if newFp.overlaps(fp) {
			return
		}
	}

	for _, cam := range g.scene.Cameras {
		fakeFp := NewFocalPoint(cam.M.Translation(), fpRadius, "", DefaultTTL)
		if newFp.overlaps(fakeFp) {
			return
		}
	}

	// create new focal point
	newFp.id = assignID()
	logrus.WithField("pos", p.AsStr()).Println("Spawning new focal point")

	g.focalPoints[newFp.id] = newFp
	g.publishFocalPoints()
}

func (g *Grid) publishFocalPoints() {
	var points []*broker.FocalPoint
	for _, fp := range g.focalPoints {
		points = append(points, fp.ToMsg())
	}

	msg := broker.FocalPoints{
		FocalPoints: points,
	}

	g.broker.Publish(msg)

	/*
			self.send({
		                "type": "focal-points",
		                "data": {
		                    "focal_points": [fp.to_object() for fp in focal_points.values()]
		                }
		            })

	*/
}

func (g *Grid) cleanupStale() {
	var toRemove []string
	for id, fp := range g.focalPoints {
		if fp.isExpired() {
			toRemove = append(toRemove, id)
		}
	}

	// TODO: focalpoints will need synchrnoization
	for _, id := range toRemove {
		delete(g.focalPoints, id)
	}

	g.publishFocalPoints()
}
func (g *Grid) ClosestFocalPointTo(p geom.Vec) (*FocalPoint, float64) {
	minDist := maxFloat
	var minFp *FocalPoint

	for _, fp := range g.focalPoints {
		d2 := fp.pos.Sub(p).AbsSq()
		if d2 < 1e-5 {
			continue
		}
		if d2 < minDist {
			minDist = d2
			minFp = fp
		}
	}

	if minFp != nil {
		return minFp, math.Sqrt(minDist)
	}

	return nil, -1
}

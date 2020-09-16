package grid

import (
	"fmt"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"gonum.org/v1/gonum/mat"
	"math"
	"strings"
	"sync"
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

	layers map[string]*mat.Dense
	lock   sync.Mutex // currently coarse-grained locking (API-level)

	_focalPoints *focalPoints

	scene  *scene.Scene
	broker *broker.Broker
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
		scene:  scene,
		scaleX: float64(imgsizeX) / (maxX - minX),
		scaleY: float64(imgsizeY) / (maxY - minY),
		layers: map[string]*mat.Dense{},
		broker: broker,
		_focalPoints: &focalPoints{
			focalPoints: map[string]*focalPoint{},
			broker:      broker,
			scene:       scene,
		},
	}

	return g
}

func (g *Grid) withLock(callback func()) {
	g.lock.Lock()
	defer g.lock.Unlock()
	callback()
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
	hit := g._focalPoints.traceFocalPoints(p0, p1)

	if !hit {
		g.withLock(func() {
			g.traceGrid(cameraName, p0, p1)
		})
	}
	g._focalPoints.publishFocalPoints()
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
		g.withLock(func() {
			g.maybeSpawnFocalPoint()
		})
		g._focalPoints.mergeOverlappingFocalPoints()
		g.withLock(func() {
			g.decay()
		})
		g._focalPoints.cleanupStale()
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

	g._focalPoints.maybeSpawnFocalPoint(p)
}

func (g *Grid) GetFocalPoints() []*FocalPoint {
	return g._focalPoints.getFocalPoints()
}

func (g *Grid) ClosestFocalPointTo(p geom.Vec) (*FocalPoint, float64) {
	return g._focalPoints.closestFocalPointTo(p)
}

package main

import (
	"bytes"
	"encoding/json"
	"github.com/ajstarks/svgo/float"
	"math"
	"math/rand"
	"os"
	"strconv"
)

func rn2(a, b float64) float64 {
	return rand.Float64()*(b-a) + a
}

const (
	xPad    = 10.0
	yPad    = 8.0
	width   = 146.0
	height  = 79.0
	yOffset = 100.0

	numCircles    = 2500 / 2
	numCandidates = 1000 / 2

	maxR        = 9
	minR        = 1
	minDistance = 1.0
)

type circle struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
	R float64 `json:"r"`
}

func addCircle(circles []*circle) ([]*circle, bool) {
	bestCandidate := &circle{R: -1e99}

	for i := 0; i < numCandidates; i++ {
		x := rn2(0-25, 146+25+yOffset)
		y := rn2(0-25, 79+25+yOffset)

		candidate := &circle{X: x, Y: y, R: 1e99}

		for _, c := range circles {
			d := math.Sqrt(math.Pow(candidate.X-c.X, 2) + math.Pow(candidate.Y-c.Y, 2))
			to := d - c.R - minDistance
			if to < candidate.R {
				candidate.R = to
			}

			if candidate.R < 0 {
				break
			}
		}

		if candidate.R > bestCandidate.R {
			bestCandidate = candidate
		}
	}

	if bestCandidate.R < 0 {
		return circles, false
	}

	bestCandidate.R = math.Min(bestCandidate.R, maxR-minDistance)

	if bestCandidate.R < minR {
		return circles, false
	}

	circles = append(circles, bestCandidate)

	return circles, true
}

func main() {
	seed, err := strconv.ParseInt(os.Args[1], 10, 64)
	if err != nil {
		panic(err)
	}
	rand.Seed(seed)

	var svgBuf bytes.Buffer

	canvas := svg.New(&svgBuf)
	canvas.Start(width, height)

	canvas.Rect(xPad, yPad+yOffset, width-2*xPad, height-2*yPad, "fill:black;stroke:black")

	var circles []*circle
	var ok bool

	for i := 0; i < numCircles; i++ {
		circles, ok = addCircle(circles)
		if !ok {
			break
		}
	}

	var result []*circle
	for _, c := range circles {
		r := c.R
		if r < minR {
			continue
		}
		canvas.Circle(c.X, c.Y, r, "fill:white;stroke:white")
		result = append(result, &circle{c.X, c.Y, r})
	}
	canvas.End()

	output, err := json.Marshal(circles)
	if err != nil {
		panic(err)
	}
	os.Stdout.Write(output)
	//fmt.Fprintf(os.Stderr, "number of circles: %d\n", count)
}

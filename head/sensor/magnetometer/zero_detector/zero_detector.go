package zero_detector

import (
	"bytes"
	"fmt"
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/sensor/magnetometer"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/plotutil"
	"gonum.org/v1/plot/vg"
	"math"
	"math/rand"
	"sync"
)

var metricsOnce sync.Once
var gStepDelta prometheus.Gauge

type ZeroDetector struct {
	logger                *zap.Logger
	sensor                magnetometer.Sensor
	ch                    chan result
	numSteps              int
	once                  sync.Once
	directionChangePauses int
	findDirection         motor.Direction
	predicted             *atomic.Int32
	stepped               *atomic.Int32
	getSteps              func() int
	gStepDelta            prometheus.Gauge
	svgCallback           func(string, []byte)
}

type result struct {
	direction motor.Direction
	done      bool
}

func NewZeroDetector(
	logger *zap.Logger,
	sensor magnetometer.Sensor,
	numSteps int,
	directionChangePauses int,
	getSteps func() int,
	svgCallback func(string, []byte),
) *ZeroDetector {
	var findDirection motor.Direction
	if rand.Float64() < 0.50 {
		findDirection = motor.Forward
	} else {
		findDirection = motor.Backward
	}

	metricsOnce.Do(func() {
		gStepDelta = metrics.SimpleGauge(
			prometheus.DefaultRegisterer,
			"head",
			"zero_detector_step_delta",
		)
	})

	d := &ZeroDetector{
		logger:                logger,
		sensor:                sensor,
		ch:                    make(chan result),
		numSteps:              numSteps,
		directionChangePauses: directionChangePauses + 2, // add a little padding
		findDirection:         findDirection,
		getSteps:              getSteps,
		predicted:             atomic.NewInt32(0),
		stepped:               atomic.NewInt32(0),
		gStepDelta:            gStepDelta,
		svgCallback:           svgCallback,
	}

	return d
}

func (d *ZeroDetector) Act(pos, target int) (direction motor.Direction, done bool) {
	direction, done = d.getStep()
	if done {
		actual := int(d.stepped.Load())
		predicted := int(d.predicted.Load())

		actual = Mod(actual, d.numSteps)
		predicted = Mod(predicted, d.numSteps)
		delta := actual - predicted

		if delta > d.numSteps/2 {
			delta -= d.numSteps
		}

		d.logger.Debug(
			"finished finding zero",
			zap.Int("predicted", predicted),
			zap.Int("actual", actual),
			zap.Int("delta", delta),
		)

		d.gStepDelta.Set(float64(delta))
	}
	return direction, done
}

func (d *ZeroDetector) Name() string {
	return "magnetometer zero detector"
}

func (d *ZeroDetector) Finish(controller *motor.Controller) {
	controller.SetCurrentPositionAsZero()
}

func (d *ZeroDetector) getStep() (motor.Direction, bool) {
	d.once.Do(func() {
		go d.controller()
	})

	// this may read from the closed channel, which will result in result.open == false
	result := <-d.ch
	d.stepped.Add(int32(result.direction))

	return result.direction, result.done
}

func (d *ZeroDetector) find(
	name string,
	steps int,
	findDirection motor.Direction,
	pause bool,
) (int, error) {
	var values []float64

	d.pause()

	points := make([]*magnetometer.Reading, steps)

	for i := 0; i < steps; i++ {
		if pause {
			d.pause()
		}

		read, err := d.sensor.Read()
		if err != nil {
			return 0, errors.Wrap(err, "read sensor")
		}
		points[i] = read

		val := math.Abs(read.Bz) - math.Abs(read.By)
		values = append(values, val)

		d.ch <- result{direction: findDirection}
	}

	go d.plot(name, points)

	_, idx := maxIdx(values)
	return idx * int(findDirection), nil
}

func (d *ZeroDetector) seek(name string, numSteps int) error {
	target := Mod(numSteps, d.numSteps)

	direction := motor.Forward

	if target > d.numSteps/2 {
		// if fewer steps, move in the reverse
		direction = motor.OppositeDirection(direction)
		target = d.numSteps - target
	}

	d.pause()

	points := make([]*magnetometer.Reading, target)
	for i := 0; i < target; i++ {
		read, err := d.sensor.Read()
		if err != nil {
			return errors.Wrap(err, "read sensor")
		}
		points[i] = read
		d.ch <- result{direction: direction}
	}

	go d.plot(name, points)

	d.pause()

	return nil
}

func (d *ZeroDetector) done() {
	d.ch <- result{direction: motor.NoStep, done: true}
	close(d.ch)
}

func (d *ZeroDetector) controller() {
	const NumSlowSteps = 50
	const stepsBack = NumSlowSteps / 2

	d.pause()
	predicted := Mod(d.numSteps-d.getSteps(), d.numSteps)
	d.predicted.Store(int32(predicted))

	d.logger.Debug("predicted find zero steps", zap.Int("predicted", predicted))

	// 1. fast, coarse-grained find
	{
		idx, err := d.find("coarse.svg", d.numSteps*2, d.findDirection, false)
		idx = Mod(idx, d.numSteps)
		if err != nil {
			d.logger.Error("find error", zap.Error(err))
			d.done()
			return
		}

		if err := d.seek("seek1.svg", idx-stepsBack); err != nil {
			d.logger.Error("seek error", zap.Error(err))
			d.done()
			return
		}
	}

	// 2. slow, fine-grained find
	{
		// with e.g. NumSlowSteps=5, we want to check positions -2, -1, 0, 1, 2 where 0 is the
		// position obtained in the fast, coarse-grained scan
		idx, err := d.find("fine.svg", NumSlowSteps, motor.Forward, true)
		if err != nil {
			d.logger.Error("find error", zap.Error(err))
			d.done()
			return
		}
		d.logger.Info("fine seek", zap.Int("idx", idx))

		if err := d.seek("seek2.svg", -NumSlowSteps); err != nil {
			d.logger.Error("seek error", zap.Error(err))
			d.done()
			return
		}

		if err := d.seek("seek3.svg", idx); err != nil {
			d.logger.Error("seek error", zap.Error(err))
			d.done()
			return
		}
	}

	d.done()
}

func (d *ZeroDetector) pause() {
	for i := 0; i < d.directionChangePauses+1; i++ {
		d.ch <- result{direction: motor.NoStep}
	}
}

func (d *ZeroDetector) plot(
	name string,
	points []*magnetometer.Reading,
) {
	p := plot.New()

	p.Title.Text = fmt.Sprintf("Magnet Sensor (%s)", name)
	p.X.Label.Text = "idx"
	p.Y.Label.Text = "B"

	var ptsX, ptsY, ptsZ, ptsVal plotter.XYs

	for i, pt := range points {
		ptsX = append(ptsX, plotter.XY{
			X: float64(i),
			Y: pt.Bx,
		})

		ptsY = append(ptsY, plotter.XY{
			X: float64(i),
			Y: pt.By,
		})

		ptsZ = append(ptsZ, plotter.XY{
			X: float64(i),
			Y: pt.Bz,
		})

		ptsVal = append(ptsVal, plotter.XY{
			X: float64(i),
			Y: math.Abs(pt.Bz) - math.Abs(pt.By),
		})
	}

	if err := plotutil.AddLinePoints(p,
		"x", ptsX, "y", ptsY, "z", ptsZ, "val", ptsVal,
	); err != nil {
		d.logger.Error("plot error", zap.Error(errors.Wrap(err, "add line points")))
		return
	}

	length := vg.Length(len(points)) / 20.0 * vg.Inch
	w, err := p.WriterTo(length, 4*vg.Inch, "svg")
	buf := bytes.NewBuffer(nil)
	_, err = w.WriteTo(buf)
	if err != nil {
		d.logger.Error("plot error", zap.Error(errors.Wrap(err, "write to")))
		return
	}

	d.svgCallback(name, buf.Bytes())
}

func maxIdx(values []float64) (float64, int) {
	max := math.SmallestNonzeroFloat64
	idx := -1

	for i, v := range values {
		if v > max {
			idx = i
			max = v
		}
	}

	return max, idx
}

func Mod(x, y int) int {
	result := x % y
	if result < 0 {
		return result + y
	}
	return result
}

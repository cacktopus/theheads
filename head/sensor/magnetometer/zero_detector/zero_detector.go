package zero_detector

import (
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/sensor/magnetometer"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"math"
	"math/rand"
	"sync"
)

type ZeroDetector struct {
	logger                *zap.Logger
	sensor                magnetometer.Sensor
	ch                    chan result
	numSteps              int
	once                  sync.Once
	directionChangePauses int
	findDirection         motor.Direction
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
) *ZeroDetector {
	var findDirection motor.Direction
	if rand.Float64() < 0.50 {
		findDirection = motor.Forward
	} else {
		findDirection = motor.Backward
	}

	d := &ZeroDetector{
		logger:                logger,
		sensor:                sensor,
		ch:                    make(chan result),
		numSteps:              numSteps,
		directionChangePauses: directionChangePauses + 2, // add a little padding
		findDirection:         findDirection,
	}

	return d
}

func (d *ZeroDetector) Act(pos, target int) (direction motor.Direction, done bool) {
	return d.getStep()
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
	return result.direction, result.done
}

func (d *ZeroDetector) find(
	steps int,
	findDirection motor.Direction,
	pause bool,
) (int, error) {
	var values []float64

	d.pause()

	for i := 0; i < steps; i++ {
		if pause {
			d.pause()
		}

		read, err := d.sensor.Read()
		if err != nil {
			return 0, errors.Wrap(err, "read sensor")
		}

		values = append(values, read.B)

		d.ch <- result{direction: findDirection}
	}

	_, idx := maxIdx(values)
	return idx * int(findDirection), nil
}

func (d *ZeroDetector) seek(numSteps int) {
	target := Mod(numSteps, d.numSteps)

	direction := motor.Forward

	if target > d.numSteps/2 {
		// if fewer steps, move in the reverse
		direction = motor.OppositeDirection(direction)
		target = d.numSteps - target
	}

	d.pause()

	for i := 0; i < target; i++ {
		d.ch <- result{direction: direction}
	}

	d.pause()
}

func (d *ZeroDetector) done() {
	d.ch <- result{direction: motor.NoStep, done: true}
	close(d.ch)
}

func (d *ZeroDetector) controller() {
	const NumSlowSteps = 5
	const stepsBack = NumSlowSteps / 2

	// 1. fast, coarse-grained find
	{
		idx, err := d.find(d.numSteps, d.findDirection, false)
		if err != nil {
			d.logger.Error("error reading sensor", zap.Error(err))
			d.done()
			return
		}

		d.seek(idx - stepsBack)
	}

	// 2. slow, fine-grained find
	{
		// with e.g. NumSlowSteps=5, we want to check positions -2, -1, 0, 1, 2 where 0 is the
		// position obtained in the fast, coarse-grained scan
		idx, err := d.find(NumSlowSteps, motor.Forward, true)
		if err != nil {
			d.logger.Error("error reading sensor", zap.Error(err))
			d.done()
			return
		}

		d.seek(idx - NumSlowSteps)
	}

	d.done()
}

func (d *ZeroDetector) pause() {
	for i := 0; i < d.directionChangePauses+1; i++ {
		d.ch <- result{direction: motor.NoStep}
	}
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

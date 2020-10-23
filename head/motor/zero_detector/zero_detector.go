package zero_detector

import (
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/sensor"
	"go.uber.org/zap"
)

type result struct {
	direction motor.Direction
	open      bool
}

type Detector struct {
	sensor sensor.Sensor

	numSteps              int
	directionChangePauses int

	ch     chan result
	logger *zap.Logger
}

func (d *Detector) Name() string {
	return "ZeroDetector"
}

func NewDetector(logger *zap.Logger, sensor sensor.Sensor, numSteps int, directionChangePauses int) *Detector {
	d := &Detector{
		logger:                logger,
		sensor:                sensor,
		numSteps:              numSteps,
		directionChangePauses: directionChangePauses,
		ch:                    make(chan result),
	}

	go d.controller()

	return d
}

func (d *Detector) Act(pos, target int) (motor.Direction, bool) {
	return d.getStep()
}

func (d *Detector) getStep() (motor.Direction, bool) {
	// this may read from the closed channel, which will result in result.open == false
	result := <-d.ch

	return result.direction, !result.open
}

func (d *Detector) step(direction motor.Direction) bool {
	d.ch <- result{
		direction: direction,
		open:      true,
	}

	return false
}

func (d *Detector) pause() (done bool) {
	for i := 0; i < d.directionChangePauses; i++ {
		if done := d.step(motor.NoStep); done {
			return done
		}
	}
	return false
}

func (d *Detector) stepUntil(
	direction motor.Direction,
	targetValue bool,
	stepCount int,
) (done bool) {
	count := 0

	for count < stepCount {
		value, err := d.sensor.Read()
		if err != nil {
			return true // TODO: make this an actual error
		}

		if value == targetValue {
			count++
		} else {
			count = 0
		}

		if done := d.step(direction); done {
			return done
		}
	}

	return false
}

func (d *Detector) controller() {
	defer close(d.ch)

	// 1) find a spot that is off the sensor

	if done := d.pause(); done {
		return
	}

	if done := d.stepUntil(motor.Forward, false, 20); done {
		return
	}

	if done := d.pause(); done {
		return
	}

	if done := d.stepUntil(motor.Backward, false, 10); done {
		return
	}

	if done := d.pause(); done {
		return
	}

	// 2) sweep an entire circle

	var active []int
	for i := 0; i < d.numSteps; i++ {
		value, err := d.sensor.Read()
		if err != nil {
			d.logger.Error("error reading sensor", zap.Error(err))
		}

		if value {
			d.logger.Debug("sensor active", zap.Int("i", i))
			active = append(active, i)
		}
		if done := d.step(motor.Forward); done {
			return
		}
	}

	steps := 0
	if len(active) > 0 {
		d.logger.Debug("active sensor steps", zap.Ints("active", active))
		sum := 0
		for _, pos := range active {
			sum += pos
		}
		steps = sum / len(active)
		d.logger.Info("steps to zero", zap.Int("steps", steps))
	} else {
		d.logger.Error("sensor was not active during scan")
	}

	// Step backward if the path is shorter
	adjustDirection := motor.Forward
	if steps > d.numSteps/2 {
		adjustDirection = motor.Backward
		steps = d.numSteps - steps
	}

	if done := d.pause(); done {
		return
	}

	for i := 0; i < steps; i++ {
		if done := d.step(adjustDirection); done {
			return
		}
	}

	if done := d.pause(); done {
		return
	}
}

func (d *Detector) Finish(controller *motor.Controller) {
	controller.SetCurrentPositionAsZero()
}

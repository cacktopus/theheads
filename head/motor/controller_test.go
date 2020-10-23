package motor_test

import (
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/fake_stepper"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestController_Step(t *testing.T) {
	c := motor.NewController(
		nil,
		fake_stepper.NewMotor(),
		nil,
		200,
		30,
		3,
		"head-03",
		nil,
	)

	stepAndCheck := func(direction motor.Direction, expected int) {
		err := c.Step(direction)
		assert.NoError(t, err)
		pos, _ := c.State()
		assert.Equal(t, pos, expected)
	}

	stepAndCheck(motor.Forward, 1)
	stepAndCheck(motor.Forward, 2)
	stepAndCheck(motor.Backward, 2)
	stepAndCheck(motor.Backward, 2)
	stepAndCheck(motor.Backward, 2)
	stepAndCheck(motor.Backward, 1)

	stepAndCheck(motor.Forward, 1)
	stepAndCheck(motor.Backward, 0)

	stepAndCheck(motor.Forward, 0)
	stepAndCheck(motor.Forward, 0)
	stepAndCheck(motor.Forward, 0)
	stepAndCheck(motor.Forward, 1)

	stepAndCheck(motor.NoStep, 1)
	stepAndCheck(motor.NoStep, 1)
	stepAndCheck(motor.NoStep, 1)

	stepAndCheck(motor.Backward, 0)
}

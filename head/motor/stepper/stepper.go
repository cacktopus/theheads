package stepper

import (
	"github.com/cacktopus/theheads/head/motor"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gobot.io/x/gobot/drivers/i2c"
	"gobot.io/x/gobot/platforms/raspi"
)

var stepMap = map[motor.Direction]i2c.AdafruitDirection{
	motor.Forward:  i2c.AdafruitForward,
	motor.Backward: i2c.AdafruitBackward,
}

type Motor struct {
	logger *zap.Logger
	driver *i2c.AdafruitMotorHatDriver
}

func (s *Motor) Start() error {
	return s.driver.Start()
}

func New(logger *zap.Logger) (*Motor, error) {
	r := raspi.NewAdaptor()
	driver := i2c.NewAdafruitMotorHatDriver(r)

	// Set to a large value; we want to set a really small delay
	// so that we can control the steps and delays ourself
	err := driver.SetStepperMotorSpeed(0, 1_000_000)
	if err != nil {
		return nil, errors.Wrap(err, "set motor speed")
	}

	return &Motor{
		logger: logger,
		driver: driver,
	}, nil
}

func (s *Motor) Step(direction motor.Direction) error {
	if direction == motor.NoStep {
		return nil
	}
	dir := stepMap[direction]
	err := s.driver.Step(0, 1, dir, i2c.AdafruitSingle)
	return errors.Wrap(err, "step")
}

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

	motorID int
}

func (s *Motor) Start() error {
	return s.driver.Start()
}

func New(logger *zap.Logger, motorID int) (*Motor, error) {
	r := raspi.NewAdaptor()
	driver := i2c.NewAdafruitMotorHatDriver(r)

	// Set to a large value; we want to set a really small delay
	// so that we can control the steps and delays ourselves
	err := driver.SetStepperMotorSpeed(motorID, 1_000_000)
	if err != nil {
		return nil, errors.Wrap(err, "set motor speed")
	}

	return &Motor{
		logger:  logger,
		driver:  driver,
		motorID: motorID,
	}, nil
}

func (s *Motor) Step(direction motor.Direction) error {
	if direction == motor.NoStep {
		return nil
	}
	dir := stepMap[direction]
	err := s.driver.Step(s.motorID, 1, dir, i2c.AdafruitSingle)
	return errors.Wrap(err, "step")
}

func (s *Motor) Off() error {
	err := s.driver.RunDCMotor(s.motorID, i2c.AdafruitRelease)
	return errors.Wrap(err, "release")
}

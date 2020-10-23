package idle

import "github.com/cacktopus/theheads/head/motor"

type Idle struct{}

func New() *Idle {
	return &Idle{}
}

func (s *Idle) Finish(controller *motor.Controller) {}

func (s *Idle) Name() string {
	return "Idle"
}

func (s *Idle) Act(pos, target int) (motor.Direction, bool) {
	return motor.NoStep, false
}

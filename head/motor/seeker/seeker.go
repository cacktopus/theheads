package seeker

import "github.com/cacktopus/theheads/head/motor"

type Seeker struct {
	numSteps int
}

func New(numSteps int) *Seeker {
	return &Seeker{numSteps: numSteps}
}

func (s *Seeker) Name() string {
	return "Seeker"
}

func (s *Seeker) Act(pos, target int) (motor.Direction, bool) {
	fwd := motor.Mod(target-pos, s.numSteps)
	bck := motor.Mod(pos-target, s.numSteps)

	var mag int
	var step motor.Direction

	if fwd < bck {
		mag = fwd
		step = motor.Forward
	} else {
		mag = bck
		step = motor.Backward
	}

	if mag > 0 {
		return step, false
	}
	return motor.NoStep, false
}

func (s *Seeker) Finish(controller *motor.Controller) {}

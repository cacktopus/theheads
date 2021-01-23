package motor

// TODO:
// - Http status page

type Direction int

const (
	Forward  Direction = 1
	Backward Direction = -1
	NoStep   Direction = 0
)

func OppositeDirection(d Direction) Direction {
	switch d {
	case Forward:
		return Backward
	case Backward:
		return Forward
	case NoStep:
		return NoStep
	}

	panic("Invalid step")
}

type Motor interface {
	Step(direction Direction) error
	Start() error
}

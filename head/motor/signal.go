package motor

import (
	"context"
)

type Signal struct {
	ch  chan Direction
	ctx context.Context
}

func (d *Signal) IsDone() bool {
	select {
	case <-d.ctx.Done():
		return true
	default:
		return false
	}
}

func (d *Signal) Step(direction Direction) bool {
	if d.IsDone() {
		close(d.ch)
		return true
	}
	d.ch <- direction
	return false
}

func (d *Signal) Close() {
	close(d.ch)
}

func (d *Signal) GetStep() Direction {
	return <-d.ch
}

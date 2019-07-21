package main

import (
	"math"
)

const (
	CR = 0.95
	G  = -9.81
)

type Ball struct {
	X float64
	V float64
	R float64
	M float64

	Color led
}

func (b *Ball) Collide(b1 *Ball) {
}

func (b *Ball) PE(g float64) float64 {
	return b.M * g * b.X
}

func (b *Ball) KE() float64 {
	return b.M * b.V * b.V
}

type Plane struct {
	X       float64
	N       float64
	Impulse float64
}

func (pl *Plane) CollideBall(b *Ball, doBounce bool) {
	r := b.R * pl.N
	p := b.X - r
	d := (p - b.X) * pl.N
	if d < 0 {
		b.X += 2 * math.Abs(d) * pl.N
		b.V *= -CR

		if doBounce {
			var dir float64
			if b.V < 0 {
				dir = -1
			} else {
				dir = +1
			}

			b.V += dir * (pl.Impulse * pl.N) / b.M
		}
	}
}

func collide(b0, b1 *Ball) {
	if b1.X < b0.X {
		b1, b0 = b0, b1
	}
	// b1 is higher or equal to b0

	dx := b1.X - b0.X
	r2 := b1.R - b0.R

	if dx > r2 {
		return
	}

	gap := r2 - dx
	b0.X -= gap
	b1.X += gap

	dv := b1.V - b0.V
	if dv > 0 {
		return
	}

	dem := 1/b0.M + 1/b1.M
	num := dv * (1 + CR)

	j := num / dem

	b0.V += j / b0.M
	b1.V += j / b1.M
}

func collideAll(balls []*Ball) {
	for i := 0; i < len(balls); i++ {
		for j := i + 1; j < len(balls); j++ {
			collide(balls[i], balls[j])
		}
	}
}

type Simulation struct {
	Balls  []*Ball
	Planes []*Plane
	G      float64
}

func (sim *Simulation) Tick(t, dt float64) {
	da := sim.G * dt

	for {
		// ball/plane collisions
		for _, b := range sim.Balls {
			b.V += da
			b.X += b.V * dt

			energy := b.KE() + b.PE(sim.G)
			doBounce := energy < 50.0

			for _, pl := range sim.Planes {
				pl.CollideBall(b, doBounce)
			}
		}

		// ball/ball collisions
		collideAll(sim.Balls)

		t += dt
	}
}

func Bounce() *Simulation {
	balls := []*Ball{
		{
			X:     4,
			M:     2.5,
			R:     1 / 6,
			Color: led{0, 0, 0.20},
		},

		{
			X:     3,
			M:     3,
			R:     1 / 6,
			Color: led{0, 0.20, 0},
		},

		{
			X:     2,
			M:     4,
			R:     1 / 6,
			Color: led{0.14, 0.14, 0},
		},

		{
			X:     1,
			M:     8,
			R:     1 / 6,
			Color: led{0.20, 0, 0},
		},
	}

	planes := []*Plane{
		{
			X:       0,
			N:       1,
			Impulse: 15,
		},
	}

	return &Simulation{
		Balls:  balls,
		Planes: planes,
		G:      G,
	}
}

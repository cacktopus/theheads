package main

import (
	"math/rand"
)

func cycle(callbacks ...callback) callback {
	count := rand.Int()

	return func(strip *Strip, t, dt float64) {
		if rand.Float64() < 0.0005 {
			count++
		}

		i := count % len(callbacks)
		cb := callbacks[i]

		cb(strip, t, dt)
	}
}

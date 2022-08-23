package leds

import (
	"math"
	"math/rand" // maybe I want crypto/rand :)
	"time"
)

func sigmoid(x float64) float64 {
	return 1 / (1 + math.Exp(-x))
}

func halfSigmoid(x float64) float64 {
	if x < 0.5 {
		return x
	}
	return sigmoid(x)
}

func raindrops(app *App) callback {
	rand.Seed(time.Now().UnixNano())

	const (
		probability = 0.001
		decay       = 0.99
		smear       = 0.30
	)

	n := len(app.strip.leds)

	bufLed := make([]Led, n)
	bufSmr := make([]Led, n)

	fade := newFader2(app.env, n, &faderConfig{
		timeScale: 0.3,
	})

	return func(t, dt float64) {
		// add new drops
		for i := 0; i < n; i++ {
			_ = fade
			if rand.Float64() < probability {
				bufLed[i].r = 0
				bufLed[i].g = 0
				bufLed[i].b += 0.5
			}
		}

		// decay in-place
		for i := 0; i < n; i++ {
			bufLed[i].r *= decay
			bufLed[i].g *= decay
			bufLed[i].b *= decay
		}

		// reset smear
		for i := 0; i < n; i++ {
			bufSmr[i].r = 0
			bufSmr[i].g = 0
			bufSmr[i].b = 0
		}

		// calculate smear
		for i := 0; i < n; i++ {
			left := mod(i-1, n)
			rght := mod(i+1, n)

			r := bufLed[i].r * smear
			g := bufLed[i].g * smear
			b := bufLed[i].b * smear

			bufSmr[left].r += r
			bufSmr[left].g += g
			bufSmr[left].b += b

			bufSmr[rght].r += r
			bufSmr[rght].g += g
			bufSmr[rght].b += b
		}

		// combine
		for i := 0; i < n; i++ {
			bufLed[i].r -= bufLed[i].r * (1.5 * smear)
			bufLed[i].r += bufSmr[i].r

			bufLed[i].g -= bufLed[i].g * (1.5 * smear)
			bufLed[i].g += bufSmr[i].g

			bufLed[i].b -= bufLed[i].b * (1.5 * smear)
			bufLed[i].b += bufSmr[i].b
		}

		// copy to strip
		for i := 0; i < n; i++ {
			app.strip.leds[i].r = bufLed[i].r
			app.strip.leds[i].g = bufLed[i].g
			app.strip.leds[i].b = 2 * halfSigmoid(bufLed[i].b)
		}
	}
}

func mod(i int, n int) int {
	m := i % n
	if m < 0 {
		return m + n
	}
	return m
}

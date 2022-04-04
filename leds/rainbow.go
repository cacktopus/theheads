package leds

import (
	"github.com/larspensjo/Go-simplex-noise/simplexnoise"
	"math"
)

const (
	meter = 1.0
	inch  = 0.0254 * meter

	ledRingRadius = (15.0/2 - 1) * inch
)

func rainbow(strip *Strip) callback {
	// Calculate real-world approximate position of LEDS
	positions := make([]Vec2, strip.NumActiveLeds())

	N := strip.NumActiveLeds()
	strip.Each(func(i int, led *Led) {
		theta := (2 * math.Pi) * (float64(i) / float64(N))
		u := Vec2{math.Cos(theta), math.Sin(theta)}
		u = u.Scale(ledRingRadius * 3.333)
		positions[i] = u
	})

	return func(env *config, strip *Strip, t, dt float64) {
		timeScale := 0.3

		strip.Each(func(i int, led *Led) {
			pos := positions[i]
			led.r = env.Range.R * (0.5 + 0.5*simplexnoise.Noise3(
				pos.x+000,
				pos.y+000,
				t*timeScale,
			))

			led.g = env.Range.G * (0.5 + 0.5*simplexnoise.Noise3(
				pos.x+100,
				pos.y+100,
				t*timeScale,
			))

			led.b = env.Range.B * (0.5 + 0.5*simplexnoise.Noise3(
				pos.x+200,
				pos.y+200,
				t*timeScale,
			))
		})
	}
}

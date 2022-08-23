package leds

import (
	"math"
	"math/rand"
)

func lowred(app *App) callback {
	return func(t, dt float64) {
		app.strip.Each(func(_ int, led *Led) {
			led.r = app.env.Range.R * app.env.Lowred
			led.g = 0
			led.b = 0
		})
	}
}

func highred(app *App) callback {
	return func(t, dt float64) {
		app.strip.Each(func(_ int, led *Led) {
			led.r = app.env.Range.R
			led.g = 0
			led.b = 0
		})
	}
}

func white(app *App) callback {
	return func(t, dt float64) {
		app.strip.Each(func(_ int, led *Led) {
			led.r = app.env.Range.R
			led.g = app.env.Range.G
			led.b = app.env.Range.B
		})
	}
}

func randomVector(scale float64) (float64, float64, float64) {
	for {
		x := rand.Float64()
		y := rand.Float64()
		z := rand.Float64()

		mag2 := x*x + y*y + z*z

		if mag2 > 1 {
			continue
		}

		mag := math.Sqrt(mag2)
		x /= mag
		y /= mag
		z /= mag

		return x * scale, y * scale, z * scale
	}
}

func solidRandom(app *App) callback {
	r, g, b := randomVector(0.80)
	return func(t, dt float64) {
		app.strip.Each(func(_ int, led *Led) {
			led.r = r
			led.g = g
			led.b = b
		})
	}
}

func decay(app *App) callback {
	return func(t, dt float64) {
		decayConstant := 0.99

		if t < 30 {
			app.strip.Each(func(_ int, led *Led) {
				led.r *= decayConstant
				led.g *= decayConstant
				led.b *= decayConstant
			})
		} else {
			app.strip.Each(func(_ int, led *Led) {
				led.r = 0.10
				led.g = 0
				led.b = 0
			})
		}
	}
}

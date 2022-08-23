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

func rainbow1(app *App, cfg *faderConfig) callback {
	fade := newFader(app, cfg)

	return func(t, dt float64) {
		fade.fade(0, t)
	}
}

func rainbow2(app *App, cfg *faderConfig) callback {
	fade := newFader(app, cfg)

	return func(t, dt float64) {
		fade.fade(8*math.Sin(t/4.0), t)
	}
}

type faderConfig struct {
	timeScale float64
}

type fader struct {
	positions []Vec2
	cfg       *faderConfig
	app       *App
}

func newFader(app *App, cfg *faderConfig) *fader {
	return &fader{
		app:       app,
		cfg:       cfg,
		positions: make([]Vec2, app.strip.NumActiveLeds()),
	}
}

func (f *fader) fade(
	theta float64,
	t float64,
) {
	f.calculatePositions(theta)

	f.app.strip.Each(func(i int, led *Led) {
		pos := f.positions[i]
		led.r = f.app.env.Range.R * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+000,
			pos.y+000,
			t*f.cfg.timeScale,
		))

		led.g = f.app.env.Range.G * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+100,
			pos.y+100,
			t*f.cfg.timeScale,
		))

		led.b = f.app.env.Range.B * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+200,
			pos.y+200,
			t*f.cfg.timeScale,
		))
	})
}

func (f *fader) calculatePositions(theta float64) {
	n := len(f.positions)

	// Calculate real-world approximate position of LEDS, rotated by theta
	for i := 0; i < n; i++ {
		phi := (2 * math.Pi) * (float64(i) / float64(n))
		phi += theta // rotate
		u := Vec2{math.Cos(phi), math.Sin(phi)}
		u = u.Scale(ledRingRadius * 3.333)
		f.positions[i] = u
	}
}

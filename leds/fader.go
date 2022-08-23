package leds

import (
	"github.com/larspensjo/Go-simplex-noise/simplexnoise"
	"math"
)

type fader2 struct {
	env *config
	cfg *faderConfig
	n   int // number of leds
}

func newFader2(env *config, n int, cfg *faderConfig) *fader2 {
	return &fader2{
		env: env,
		cfg: cfg,
		n:   n,
	}
}

func (f *fader2) fade(
	theta float64,
	t float64,
	i int,
) Led {
	pos := f.calculatePosition(theta, i)

	r := f.env.Range.R * (0.5 + 0.5*simplexnoise.Noise3(
		pos.x+000,
		pos.y+000,
		t*f.cfg.timeScale,
	))

	g := f.env.Range.G * (0.5 + 0.5*simplexnoise.Noise3(
		pos.x+100,
		pos.y+100,
		t*f.cfg.timeScale,
	))

	b := f.env.Range.B * (0.5 + 0.5*simplexnoise.Noise3(
		pos.x+200,
		pos.y+200,
		t*f.cfg.timeScale,
	))

	return Led{r: r, g: g, b: b}
}

func (f *fader2) calculatePosition(theta float64, i int) Vec2 {
	// Calculate real-world approximate position of led, rotated by theta
	phi := (2 * math.Pi) * (float64(i) / float64(f.n))
	phi += theta // rotate
	result := Vec2{math.Cos(phi), math.Sin(phi)}
	return result.Scale(ledRingRadius * 3.333)
}

package leds

import "time"

type config struct {
	NumLeds    int     `envconfig:"default=150"`
	StartIndex int     `envconfig:"default=10"`
	Length     float64 `envconfig:"default=5"`

	Animation string `envconfig:"default=rainbow"`

	UpdatePeriod time.Duration `envconfig:"default=40ms"`
	EnableIR     bool          `envconfig:"default=false"`

	Scale    float64 `envconfig:"default=1.0"`
	MinScale float64 `envconfig:"default=0.3"`

	Lowred float64 `envconfig:"default=0.5"`

	Range struct {
		R float64 `envconfig:"default=0.75"`
		G float64 `envconfig:"default=0.75"`
		B float64 `envconfig:"default=0.75"`
	}

	Debug bool `envconfig:"default=false"`
}

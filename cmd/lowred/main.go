package main

import (
	"github.com/cacktopus/theheads/common/geom"
	ws281x "github.com/rpi-ws281x/rpi-ws281x-go"
	"github.com/vrischmann/envconfig"
	"time"
)

type cfg struct {
	NumLeds int     `envconfig:"default=150"`
	R       float64 `envconfig:"default=0"`
	G       float64 `envconfig:"default=0"`
	B       float64 `envconfig:"default=0.4"`
}

func main() {
	env := &cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	opt := ws281x.DefaultOptions
	opt.Channels[0].Brightness = 255

	opt.Channels[0].LedCount = env.NumLeds // TODO: env
	opt.Channels[0].GpioPin = 18

	strip, err := ws281x.MakeWS2811(&opt)
	if err != nil {
		panic(err)
	}

	err = strip.Init()
	if err != nil {
		panic(err)
	}

	clear(strip, env.NumLeds, env.R*1.5, env.G*1.5, env.B*1.5)
	time.Sleep(500 * time.Millisecond)
	clear(strip, env.NumLeds, env.R, env.G, env.B)
}

func clear(strip *ws281x.WS2811, numLeds int, r, g, b float64) {
	r = geom.Clamp(0, r, 1.0)
	g = geom.Clamp(0, g, 1.0)
	b = geom.Clamp(0, b, 1.0)

	for i := 0; i < numLeds; i++ {
		strip.Leds(0)[i] = uint32(r*255)<<16 + uint32(g*255)<<8 + uint32(b*255)<<0
	}

	err := strip.Render()
	if err != nil {
		panic(err)
	}
}

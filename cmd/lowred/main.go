package main

import ws281x "github.com/rpi-ws281x/rpi-ws281x-go"

const (
	numLeds = 300
)

func main() {
	opt := ws281x.DefaultOptions
	opt.Channels[0].Brightness = 255

	opt.Channels[0].LedCount = numLeds // TODO: env
	opt.Channels[0].GpioPin = 18

	strip, err := ws281x.MakeWS2811(&opt)
	if err != nil {
		panic(err)
	}

	err = strip.Init()
	if err != nil {
		panic(err)
	}

	for i := 0; i < numLeds; i++ {
		const val = 64
		strip.Leds(0)[i] = val << 16
	}

	err = strip.Render()
	if err != nil {
		panic(err)
	}
}

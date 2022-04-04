package leds

import (
	"github.com/gvalkov/golang-evdev"
)

func runIR(ch chan callback, animations map[string]callback, strip *Strip) {
	device, err := evdev.Open("/dev/input/event0")
	if err != nil {
		panic(err)
	}

	go func() {
		for {
			event, err := device.ReadOne()
			if err != nil {
				panic(err)
			}
			if event.Code == 4 && event.Type == 4 {
				// TODO: zap log unknown keys

				switch event.Value {
				case 48912: // 1
					ch <- animations["bounce"]
				case 48913: // 2
					ch <- animations["rainbow"]
				case 48896: // vol-
					strip.ScaleDown()
				case 48898: // vol+
					strip.ScaleUp()
				}
			}
		}
	}()
}

package leds

import (
	"github.com/cacktopus/theheads/leds/schema"
	"github.com/gvalkov/golang-evdev"
	"time"
)

func runIR(app *App) {
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
				app.broker.Publish(&schema.ReceivedIR{Value: event.Value})

				req := &animateRequest{newStartTime: time.Now()}

				switch event.Value {
				case 48912: // 1
					req.name = "bounce"
					app.ch <- req
				case 48913: // 2
					req.name = "rainbow1"
					app.ch <- req
				case 48914: // 3
					req.name = "rainbow2"
					app.ch <- req

				case 48916: // 4
					req.name = "raindrops"
					app.ch <- req

				case 48917: // 5
				case 48918: // 6

				case 48920: // 7
				case 48921: // 8
					//req.name = solidRandom(app)
					//app.ch <- req
				case 48922: // 9
					req.name = "white"
					app.ch <- req

				case 48905: // enter/save
					app.saveSettings()

				case 48896: // vol-
					app.strip.ScaleDown()
				case 48898: // vol+
					app.strip.ScaleUp()
				}
			}
		}
	}()
}

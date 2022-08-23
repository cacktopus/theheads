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
					req.callback = app.animations["bounce"]
					app.ch <- req
				case 48913: // 2
					req.callback = app.animations["rainbow1"]
					app.ch <- req
				case 48914: // 3
					req.callback = app.animations["rainbow2"]
					app.ch <- req

				case 48916: // 4
					req.callback = app.animations["raindrops"]
					app.ch <- req

				case 48917: // 5
				case 48918: // 6

				case 48920: // 7
				case 48921: // 8
					req.callback = solidRandom(app)
					app.ch <- req
				case 48922: // 9
					req.callback = app.animations["white"]
					app.ch <- req

				case 48905: // enter/save

				case 48896: // vol-
					app.strip.ScaleDown()
				case 48898: // vol+
					app.strip.ScaleUp()
				}
			}
		}
	}()
}

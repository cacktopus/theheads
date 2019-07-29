package main

func lowred(strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = 0.10
		led.g = 0
		led.b = 0
	})
}

func off(strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = 0
		led.g = 0
		led.b = 0
	})
}

func decay(strip *Strip, t, dt float64) {
	decayConstant := 0.99

	if t < 30 {
		strip.Each(func(_ int, led *Led) {
			led.r *= decayConstant
			led.g *= decayConstant
			led.b *= decayConstant
		})
	} else {
		strip.Each(func(_ int, led *Led) {
			led.r = 0.10
			led.g = 0
			led.b = 0
		})
	}
}

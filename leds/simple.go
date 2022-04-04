package leds

func lowred(env *config, strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = env.Range.R * env.Lowred
		led.g = 0
		led.b = 0
	})
}

func white(env *config, strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = env.Range.R
		led.g = env.Range.G
		led.b = env.Range.B
	})
}

func decay(env *config, strip *Strip, t, dt float64) {
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

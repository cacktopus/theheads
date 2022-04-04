package leds

func clamp(min, x, max float64) float64 {
	if x < min {
		return min
	}
	if x > max {
		return max
	}
	return x
}

func clampUint32(min, x, max uint32) uint32 {
	if x < min {
		return min
	}
	if x > max {
		return max
	}
	return x
}

type callback func(env *config, strip *Strip, t, dt float64)

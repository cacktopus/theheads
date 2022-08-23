package leds

import "time"

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

type callback func(t, dt float64)

type animateRequest struct {
	callback     callback
	newStartTime time.Time
}

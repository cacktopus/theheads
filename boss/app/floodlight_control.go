package app

import (
	"math/rand"
)

func (b *Boss) FloodlightControl() bool {
	switch b.Env.FloodlightController {
	case "on":
		return true
	case "off":
		return false
	case "day-night":
		night := !b.DayDetector.IsDay()
		return night // on during night
	case "random":
		return rand.Float64() < 0.5
	default:
		panic("unknown floodlight controller")
	}
}

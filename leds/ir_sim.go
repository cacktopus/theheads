//go:build !linux

package leds

func runIR(ch chan callback, animations map[string]callback, strip *Strip) {
	return
}

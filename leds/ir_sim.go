//go:build !linux

package leds

import "github.com/cacktopus/theheads/common/broker"

func runIR(
	ch chan callback,
	broker *broker.Broker,
	animations map[string]callback,
	strip *Strip,
) {
	return
}

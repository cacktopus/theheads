package main

import (
	"log"
	"periph.io/x/periph/conn/spi"
)

func adaptForSpi(data []byte) []byte {
	var result []byte = nil

	for _, b := range data {
		for _, ibit := range ibits {
			val := ((b>>(2*ibit+1))&1)*0x60 + ((b>>(2*ibit+0))&1)*0x06 + 0x88
			result = append(result, val)
		}
	}
	return result
}

type Led struct {
	r, g, b float64
}

type Strip struct {
	leds     []Led
	length   float64
	startLed int
}

func NewStrip(numLeds int, length float64) *Strip {
	return &Strip{
		leds:   make([]Led, numLeds),
		length: length,
	}
}

func (s *Strip) fill(x0, x1 int, color Led) {
	lastIndex := len(s.leds) - 1

	if x0 > x1 {
		x0, x1 = x1, x0
	}

	if x0 < 0 {
		x0 = 0
	}

	if x1 > lastIndex {
		x1 = lastIndex
	}

	for i := x0; i < x1; i++ {
		s.leds[i] = color
	}
}

func (s *Strip) tx(x float64) int {
	// TODO: very strip specific (needs config, etc)
	return int(float64(len(s.leds)) * (s.length - x) / s.length)
}

func (s *Strip) send(conn spi.Conn) {
	write := make([]byte, len(s.leds)*3)

	for i := 0; i < len(s.leds); i++ {
		write[i*3+0] = byte(255.0 * clamp(0, s.leds[i].g, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, s.leds[i].r, maxBrightness))
		write[i*3+2] = byte(255.0 * clamp(0, s.leds[i].b, maxBrightness))
	}

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := conn.Tx(adapted, read); err != nil {
		log.Fatal(err)
	}
}

func (s *Strip) Each(cb func(i int, led *Led)) {
	for i := startLed; i < len(s.leds); i++ {
		cb(i, &s.leds[i])
	}
}

package main

import (
	"log"
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
	leds       []Led
	length     float64
	startLed   int
	transactor Transactor
}

func NewStrip(numLeds int, length float64, transactor Transactor) *Strip {
	return &Strip{
		leds:       make([]Led, numLeds),
		length:     length,
		transactor: transactor,
	}
}

func (s *Strip) fill(x0, x1 int, color Led) {
	lastIndex := len(s.leds) - 1

	if x0 > x1 {
		x0, x1 = x1, x0
	}

	if x0 < startLed {
		x0 = startLed
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
	numLeds := float64(len(s.leds) - startLed)
	return int(numLeds*(x)/s.length) + startLed
}

func (s *Strip) send() {
	write := make([]byte, len(s.leds)*3)

	for i := 0; i < len(s.leds); i++ {
		write[i*3+0] = byte(255.0 * clamp(0, s.leds[i].g, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, s.leds[i].r, maxBrightness))
		write[i*3+2] = byte(255.0 * clamp(0, s.leds[i].b, maxBrightness))
	}

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := s.transactor.Tx(adapted, read); err != nil {
		log.Fatal(err)
	}
}

func (s *Strip) Each(cb func(i int, led *Led)) {
	for i := 0; i < startLed; i++ {
		s.leds[i].r = 0
		s.leds[i].g = 0
		s.leds[i].b = 0
	}

	for i := startLed; i < len(s.leds); i++ {
		cb(i, &s.leds[i])
	}
}

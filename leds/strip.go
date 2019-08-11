package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"log"
	"time"
)

const (
	maxBrightness = 0.33
)

var (
	frameRendered = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_leds_frame_rendered",
	})
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
	startIndex int
	transactor Transactor
}

func NewStrip(numLeds, startLed int, length float64, transactor Transactor) *Strip {
	return &Strip{
		leds:       make([]Led, numLeds),
		startIndex: startLed,
		length:     length,
		transactor: transactor,
	}
}

func (s *Strip) fill(x0, x1 int, color Led) {
	lastIndex := len(s.leds) - 1

	if x0 > x1 {
		x0, x1 = x1, x0
	}

	if x0 < s.startIndex {
		x0 = s.startIndex
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
	numLeds := float64(len(s.leds) - s.startIndex)
	return int(numLeds*(x)/s.length) + s.startIndex
}

func (s *Strip) send() int {
	write := make([]byte, len(s.leds)*3)

	for i := 0; i < len(s.leds); i++ {
		write[i*3+0] = byte(255.0 * clamp(0, s.leds[i].g, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, s.leds[i].r, maxBrightness))
		write[i*3+2] = byte(255.0 * clamp(0, s.leds[i].b, maxBrightness))
	}

	write = append(write, make([]byte, 200)...)

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := s.transactor.Tx(adapted, read); err != nil {
		log.Fatal(err)
	}
	frameRendered.Inc()
	time.Sleep(20 * time.Millisecond)
	sum := 0
	for _, v := range write {
		sum += int(v)
	}

	return sum
}

func (s *Strip) Each(cb func(i int, led *Led)) {
	for pos := 0; pos < s.startIndex; pos++ {
		s.leds[pos].r = 0
		s.leds[pos].g = 0
		s.leds[pos].b = 0
	}

	i := 0
	for pos := s.startIndex; pos < len(s.leds); pos++ {
		cb(i, &s.leds[pos])
		i++
	}
}

func (s *Strip) NumActiveLeds() int {
	return len(s.leds) - s.startIndex
}

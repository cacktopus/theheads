package leds

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	ws2811 "github.com/rpi-ws281x/rpi-ws281x-go"
	"sync"
)

const (
	scaleIncr = 0.02
)

var (
	frameRendered = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_leds_frame_rendered",
	})
)

type Strip struct {
	env   *config
	leds  []Led
	scale float64
	mu    sync.Mutex
	strip *ws2811.WS2811
}

func NewStrip(env *config) (*Strip, error) {
	opts := ws2811.DefaultOptions
	opts.Channels[0].GpioPin = 18
	opts.Channels[0].Brightness = 255
	opts.Channels[0].LedCount = env.NumLeds

	strip, err := ws2811.MakeWS2811(&opts)
	if err != nil {
		return nil, errors.Wrap(err, "make strip")
	}

	err = strip.Init()
	if err != nil {
		return nil, errors.Wrap(err, "init strip")
	}

	return &Strip{
		env:   env,
		leds:  make([]Led, env.NumLeds),
		scale: env.Scale,
		strip: strip,
	}, nil
}

func (s *Strip) send2() error {
	for i := 0; i < len(s.leds); i++ {
		r := uint32(255.0 * s.scale * s.leds[i].r)
		g := uint32(255.0 * s.scale * s.leds[i].g)
		b := uint32(255.0 * s.scale * s.leds[i].b)

		r = clampUint32(0, r, 255)
		g = clampUint32(0, g, 255)
		b = clampUint32(0, b, 255)

		s.strip.Leds(0)[i] = 2*r<<16 + g<<8 + b<<0

		if s.env.Debug {
			fmt.Println(g, r, b, s.strip.Leds(0)[i])
		}
	}

	err := s.strip.Render()
	return errors.Wrap(err, "render")
}

func (s *Strip) ScaleUp() {
	s.mu.Lock()
	s.scale = clamp(0, s.scale+scaleIncr, 1.0)
	s.mu.Unlock()
}

func (s *Strip) ScaleDown() {
	s.mu.Lock()
	s.scale = clamp(0, s.scale-scaleIncr, 1.0)
	s.mu.Unlock()
}

func (s *Strip) Fini() {
	s.strip.Fini()
}

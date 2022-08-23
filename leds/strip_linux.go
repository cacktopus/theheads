package leds

import (
	"fmt"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/leds/schema"
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
	env      *config
	broker   *broker.Broker
	leds     []Led
	scale    float64
	minScale float64
	mu       sync.Mutex
	hw       *ws2811.WS2811
}

func NewStrip(app *App) (*Strip, error) {
	opts := ws2811.DefaultOptions
	opts.Channels[0].GpioPin = 18
	opts.Channels[0].Brightness = 255
	opts.Channels[0].LedCount = app.env.NumLeds

	strip, err := ws2811.MakeWS2811(&opts)
	if err != nil {
		return nil, errors.Wrap(err, "make strip")
	}

	err = strip.Init()
	if err != nil {
		return nil, errors.Wrap(err, "init strip")
	}

	return &Strip{
		env:      app.env,
		broker:   app.broker,
		leds:     make([]Led, app.env.NumLeds),
		scale:    clamp(app.env.MinScale, app.env.Scale, 1.0),
		minScale: app.env.MinScale,
		mu:       sync.Mutex{},
		hw:       strip,
	}, nil
}

func (s *Strip) send2() error {
	scale := s.GetScale()

	for i := 0; i < len(s.leds); i++ {
		r := uint32(255.0 * scale * s.leds[i].r)
		g := uint32(255.0 * scale * s.leds[i].g)
		b := uint32(255.0 * scale * s.leds[i].b)

		r = clampUint32(0, r, 255)
		g = clampUint32(0, g, 255)
		b = clampUint32(0, b, 255)

		s.hw.Leds(0)[i] = r<<16 + g<<8 + b<<0

		if s.env.Debug {
			fmt.Println(g, r, b, s.hw.Leds(0)[i])
		}
	}

	err := s.hw.Render()
	return errors.Wrap(err, "render")
}

func (s *Strip) GetScale() float64 {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.scale
}

func (s *Strip) SetScale(scale float64) {
	newScale := clamp(s.minScale, scale, 1.0)
	s.mu.Lock()
	s.scale = newScale
	s.mu.Unlock()

	s.broker.Publish(&schema.Status{
		Scale: newScale,
	})
}

func (s *Strip) ScaleUp() {
	s.mu.Lock()
	newScale := clamp(s.minScale, s.scale+scaleIncr, 1.0)
	s.scale = newScale
	s.mu.Unlock()

	s.broker.Publish(&schema.Status{
		Scale: newScale,
	})
}

func (s *Strip) ScaleDown() {
	s.mu.Lock()
	newScale := clamp(s.minScale, s.scale-scaleIncr, 1.0)
	s.scale = newScale
	s.mu.Unlock()

	s.broker.Publish(&schema.Status{
		Scale: newScale,
	})
}

func (s *Strip) Fini() {
	s.hw.Fini()
}

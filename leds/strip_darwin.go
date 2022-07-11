package leds

import "github.com/cacktopus/theheads/common/broker"

type Strip struct {
	env  *config
	leds []Led
}

func NewStrip(env *config, msgBroker *broker.Broker) (*Strip, error) {
	return &Strip{
		env:  env,
		leds: make([]Led, env.NumLeds),
	}, nil
}

func (s *Strip) send2() error {
	return nil
}

func (s *Strip) Fini() {}

func (s *Strip) GetScale() float64 {
	return 1.0
}

func (s *Strip) SetScale(float64) {}

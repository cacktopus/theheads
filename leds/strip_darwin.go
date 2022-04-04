package leds

type Strip struct {
	env  *config
	leds []Led
}

func NewStrip(env *config) (*Strip, error) {
	return &Strip{
		env:  env,
		leds: make([]Led, env.NumLeds),
	}, nil
}

func (s *Strip) send2() error {
	return nil
}

func (s *Strip) Fini() {}

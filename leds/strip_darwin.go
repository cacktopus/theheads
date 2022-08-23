package leds

type Strip struct {
	env  *config
	leds []Led
}

func NewStrip(app *App) (*Strip, error) {
	return &Strip{
		env:  app.env,
		leds: make([]Led, app.env.NumLeds),
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

package leds

type Led struct {
	r, g, b float64
}

func (s *Strip) fill(x0, x1 int, color Led) {
	lastIndex := len(s.leds) - 1

	if x0 > x1 {
		x0, x1 = x1, x0
	}

	if x0 < s.env.StartIndex {
		x0 = s.env.StartIndex
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
	numLeds := float64(len(s.leds) - s.env.StartIndex)
	return int(numLeds*(x)/s.env.Length) + s.env.StartIndex
}

func (s *Strip) Each(cb func(i int, led *Led)) {
	for pos := 0; pos < s.env.StartIndex; pos++ {
		s.leds[pos].r = 0
		s.leds[pos].g = 0
		s.leds[pos].b = 0
	}

	i := 0
	for pos := s.env.StartIndex; pos < len(s.leds); pos++ {
		cb(i, &s.leds[pos])
		i++
	}
}

func (s *Strip) NumActiveLeds() int {
	return len(s.leds) - s.env.StartIndex
}

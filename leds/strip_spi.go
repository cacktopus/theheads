//go:build spi
// +build spi

package leds

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

func (s *Strip) send() error {
	write := make([]byte, len(s.leds)*3)

	s.mu.Lock()
	scale := clamp(0, s.scale, 1.0)
	s.mu.Unlock()

	for i := 0; i < len(s.leds); i++ {
		write[i*3+0] = byte(255.0 * clamp(0, s.leds[i].g*scale, s.env.Range.R))
		write[i*3+1] = byte(255.0 * clamp(0, s.leds[i].r*scale, s.env.Range.G))
		write[i*3+2] = byte(255.0 * clamp(0, s.leds[i].b*scale, s.env.Range.B))
	}

	write = append(write, make([]byte, 200)...)

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := s.transactor.Tx(adapted, read); err != nil {
		panic(err)
	}
	frameRendered.Inc()

	// This is a silly guard against having our buffers GC'ed out from under us
	time.Sleep(5 * time.Millisecond)
	return nil
}

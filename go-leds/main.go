package main

import (
	"fmt"
	"github.com/larspensjo/Go-simplex-noise/simplexnoise"
	"log"
	"periph.io/x/periph/conn/physic"
	"periph.io/x/periph/conn/spi"
	"periph.io/x/periph/conn/spi/spireg"
	"periph.io/x/periph/host"
	"time"
)

var ibits = [4]uint{3, 2, 1, 0}

const (
	numLeds       = 80
	maxBrightness = 0.33
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

func send(conn spi.Conn, leds []led) {
	write := make([]byte, numLeds*3)

	for i := 0; i < numLeds; i++ {
		// TODO: confirm rgb order
		write[i*3+0] = byte(255.0 * clamp(0, leds[i].r, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, leds[i].g, maxBrightness))
		write[i*3+2] = byte(255.0 * clamp(0, leds[i].b, maxBrightness))
	}

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := conn.Tx(adapted, read); err != nil {
		log.Fatal(err)
	}
}

func clamp(min, x, max float64) float64 {
	if x < min {
		return min
	}
	if x > max {
		return max
	}
	return x
}

type led struct {
	r, g, b float64
}

func main() {
	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		log.Fatal(err)
	}

	// Use spireg SPI port registry to find the first available SPI bus.
	p, err := spireg.Open("")
	if err != nil {
		log.Fatal(err)
	}
	defer p.Close()

	// Convert the spi.Port into a spi.Conn so it can be used for communication.
	c, err := p.Connect(3809524*physic.Hertz, spi.Mode3, 8)
	if err != nil {
		log.Fatal(err)
	}

	leds := make([]led, numLeds)

	for t := 0; ; t++ {
		for i := 0; i < numLeds; i++ {
			leds[i].r = maxBrightness * (0.5 + 0.5*simplexnoise.Noise2(float64(i+000)*0.01, float64(t)*0.003))
			leds[i].g = maxBrightness * (0.5 + 0.5*simplexnoise.Noise2(float64(i+100)*0.01, float64(t)*0.003))
			leds[i].b = maxBrightness * (0.5 + 0.5*simplexnoise.Noise2(float64(i+200)*0.01, float64(t)*0.003))
		}

		send(c, leds)

		time.Sleep(time.Millisecond * 30)
		if t%10 == 0 {
			fmt.Println(leds[0])
		}
	}
}

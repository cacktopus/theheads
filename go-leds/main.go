package main

import (
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
	numLeds = 80
)

func send(data []byte) []byte {
	var result []byte = nil

	/*
			   for rgb in data:
		        for b in rgb:
		            for ibit in range(3,-1,-1):
		                #print ibit, b, ((b>>(2*ibit+1))&1), ((b>>(2*ibit+0))&1), [hex(v) for v in tx]
		                tx.append(((b>>(2*ibit+1))&1)*0x60 +
		                          ((b>>(2*ibit+0))&1)*0x06 +
		                          0x88)
	*/

	for _, b := range data {
		for _, ibit := range ibits {
			val := ((b>>(2*ibit+1))&1)*0x60 + ((b>>(2*ibit+0))&1)*0x06 + 0x88
			result = append(result, val)
		}
	}
	return result
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

	// Write 0x10 to the device, and read a byte right after.
	write := make([]byte, numLeds*3)

	for t := 0; ; t++ {
		for i := 0; i < numLeds; i++ {
			write[i*3+0] = byte(simplexnoise.Noise2(float64(i+0)*0.01, float64(t)*0.003) * 256.0)
			write[i*3+1] = byte(simplexnoise.Noise2(float64(i+100)*0.01, float64(t)*0.003) * 256.0)
			write[i*3+2] = byte(simplexnoise.Noise2(float64(i+200)*0.01, float64(t)*0.003) * 256.0)
		}

		for pos := range write {
			write[pos] /= 32
		}

		use := send(write)
		read := make([]byte, len(use))
		if err := c.Tx(use, read); err != nil {
			log.Fatal(err)
		}

		time.Sleep(time.Millisecond * 30)
	}
}

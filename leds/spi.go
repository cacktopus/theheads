package main

import (
	"log"
	"os"
	"periph.io/x/periph/conn/physic"
	"periph.io/x/periph/conn/spi"
	"periph.io/x/periph/conn/spi/spireg"
	"periph.io/x/periph/host"
)

var ibits = [4]uint{3, 2, 1, 0}

type Transactor interface {
	Tx(w, r []byte) error
}

type NoStrip struct {
}

func (*NoStrip) Tx(w, r []byte) error {
	return nil
}

func SetupSPI() Transactor {
	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		log.Fatal(err)
	}

	_, ok := os.LookupEnv("NO_LEDS")
	var conn Transactor
	if ok {
		conn = &NoStrip{}
	} else {
		// Use spireg SPI port registry to find the first available SPI bus.
		p, err := spireg.Open("")
		if err != nil {
			log.Fatal(err)
		}
		// defer p.Close() # TODO

		// Convert the spi.Port into a spi.Conn so it can be used for communication.
		spiConn, err := p.Connect(3809524*physic.Hertz, spi.Mode3, 8)
		if err != nil {
			log.Fatal(err)
		}

		conn = spiConn
	}

	return conn
}

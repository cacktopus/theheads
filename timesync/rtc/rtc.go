package rtc

import (
	"github.com/cacktopus/theheads/timesync/rtc/ds3231"
	"github.com/pkg/errors"
	"periph.io/x/conn/v3/i2c"
	"periph.io/x/conn/v3/i2c/i2creg"
	"periph.io/x/host/v3"
)

func SetupI2C() (*ds3231.Device, error) {
	if _, err := host.Init(); err != nil {
		return nil, errors.Wrap(err, "init drivers")
	}

	// Use i2creg I2C bus registry to find the first available I2C bus.
	bus, err := i2creg.Open("")
	if err != nil {
		return nil, errors.Wrap(err, "open")
	}

	dev := &i2c.Dev{Addr: ds3231.Address, Bus: bus}
	rtc := ds3231.New(dev)

	return rtc, err
}

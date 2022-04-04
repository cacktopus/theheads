package driver

import (
	"periph.io/x/conn/v3/i2c"
	"periph.io/x/conn/v3/i2c/i2creg"
	"periph.io/x/host/v3"

	"github.com/pkg/errors"
	"time"
)

const (
	Address = 0x38

	CMD_CALIBRATE = 0xE1
	CMD_STATUS    = 0x71
	CMD_TRIGGER   = 0xAC
	CMD_SOFTRESET = 0xBA

	STATUS_BUSY       = 0x80
	STATUS_CALIBRATED = 0x08
)

var (
	ErrBusy    = errors.New("device busy")
	ErrTimeout = errors.New("timeout")
)

// Device wraps an I2C connection to an AHT20 device.
type Device struct {
	Address  uint16
	humidity uint32
	temp     uint32
	dev      *i2c.Dev
}

// New creates a new AHT20 connection. The I2C bus must already be
// configured.
//
// This function only creates the Device object, it does not touch the device.
func New() (*Device, error) {
	if _, err := host.Init(); err != nil {
		return nil, errors.Wrap(err, "init drivers")
	}

	// Use i2creg I2C bus registry to find the first available I2C bus.
	bus, err := i2creg.Open("")
	if err != nil {
		return nil, errors.Wrap(err, "open")
	}

	dev := &i2c.Dev{Addr: 0x38, Bus: bus}

	return &Device{
		Address: Address,
		dev:     dev,
	}, nil
}

// Configure the device
func (d *Device) Calibrate() error {
	err := d.dev.Tx([]byte{CMD_CALIBRATE, 0x08, 0x00}, nil)
	//_, err := d.i2c.WriteBytes([]byte{CMD_CALIBRATE, 0x08, 0x00})
	for retry := 0; retry < 3; retry++ {
		status, err := d.Status()
		if err != nil {
			return errors.Wrap(err, "status")
		}
		if status&STATUS_BUSY != 0 {
			time.Sleep(10 * time.Millisecond)
			continue
		} else {
			break
		}
	}

	status, err := d.Status()
	if err != nil {
		return errors.Wrap(err, "status")
	}

	if status&STATUS_CALIBRATED == 0 {
		return errors.New("Not calibrated")
	}

	return nil
}

// Reset the device
func (d *Device) Reset() error {
	err := d.dev.Tx([]byte{CMD_SOFTRESET}, nil)
	//_, err := d.i2c.WriteBytes([]byte{CMD_SOFTRESET})
	if err != nil {
		return errors.Wrap(err, "reset")
	}
	time.Sleep(20 * time.Millisecond)
	return nil
}

// Status of the device
func (d *Device) Status() (byte, error) {
	buf := make([]byte, 1)
	err := d.dev.Tx(nil, buf)
	//_, err := d.i2c.ReadBytes(buf)
	return buf[0], errors.Wrap(err, "status")
}

type Data struct {
	Humidity float64
	Temp     float64
}

// Read the temperature and humidity
func (d *Device) Read() (*Data, error) {
	cmd := []byte{CMD_TRIGGER, 0x33, 0x00}

	err := d.dev.Tx(cmd, nil)
	//_, err := d.i2c.WriteBytes(cmd)
	if err != nil {
		return nil, errors.Wrap(err, "cmd")
	}

	for retry := 0; retry < 3; retry++ {
		time.Sleep(80 * time.Millisecond)

		buf := make([]byte, 6)
		err := d.dev.Tx(nil, buf)
		//_, err = d.i2c.ReadBytes(buf)
		if err != nil {
			return nil, errors.Wrap(err, "cmd")
		}

		if buf[0]&0x04 == 0 {
			continue // uncalibrated
		}

		if buf[0]&STATUS_BUSY != 0 {
			continue // busy
		}

		humidity := uint32(buf[1])<<12 | uint32(buf[2])<<4 | uint32(buf[3])>>4
		temp := (uint32(buf[3])&0xF)<<16 | uint32(buf[4])<<8 | uint32(buf[5])

		return &Data{
			Humidity: float64(humidity) * 100 / 0x100000,
			Temp:     float64(temp*200.0)/0x100000 - 50,
		}, nil
	}

	return nil, ErrTimeout
}

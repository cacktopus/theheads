package magnetometer

import (
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"math"
	"periph.io/x/conn/v3/i2c/i2creg"
	"periph.io/x/conn/v3/physic"
	"periph.io/x/devices/v3/tlv493d"
	"periph.io/x/host/v3"
	"strconv"
)

type Reading struct {
	Bx, By, Bz, B float64 // milliteslas
	Temperature   float64 // Fahrenheit
}

type Sensor interface {
	Read() (*Reading, error)
	HasHardware() bool
}

type TlvSensor struct {
	tlv *tlv493d.Dev
}

func (t *TlvSensor) HasHardware() bool {
	return true
}

func (t *TlvSensor) Read() (*Reading, error) {
	read, err := t.tlv.Read(tlv493d.HighPrecisionWithTemperature)
	if err != nil {
		return nil, errors.Wrap(err, "read")
	}
	T := float64(physic.Tesla)
	mT := 1000.0

	bx := float64(read.Bx) / T
	by := float64(read.By) / T
	bz := float64(read.Bz) / T

	b := math.Sqrt(bx*bx + by*by + bz*bz)

	return &Reading{
		Bx:          bx * mT,
		By:          by * mT,
		Bz:          bz * mT,
		B:           b * mT,
		Temperature: read.Temperature.Fahrenheit(),
	}, nil
}

func Setup(logger *zap.Logger, enabled bool, i2cAddrs []string) (Sensor, error) {
	if !enabled {
		return &NullSensor{}, nil
	}

	return setupTLV(logger, i2cAddrs)
}

func setupTLV(baseLogger *zap.Logger, addrs []string) (Sensor, error) {
	var sensor Sensor
	var err error
	for _, addr := range addrs {
		logger := baseLogger.With(zap.String("address", addr))
		sensor, err = setupForAddr(
			logger,
			addr,
		)
		if err != nil {
			logger.Info("tlv setup failed for address")
			continue
		}

		logger.Info("tlv setup succeeded")
		return sensor, nil
	}
	return nil, err
}

func setupForAddr(logger *zap.Logger, i2cAddr string) (Sensor, error) {
	parsed, err := strconv.ParseInt(i2cAddr, 16, 8)
	if err != nil {
		return nil, errors.Wrap(err, "parse addr")
	}

	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		return nil, errors.Wrap(err, "init host")
	}

	// Open default I²C bus.
	bus, err := i2creg.Open("")
	if err != nil {
		return nil, errors.Wrap(err, "failed to open I2C")
	}

	// Create a new TLV493D hall effect sensor.
	opts := &tlv493d.DefaultOpts
	opts.I2cAddress = uint16(parsed)

	tlv, err := tlv493d.New(bus, opts)
	if err != nil {
		return nil, errors.Wrap(err, "new tlv493d")
	}

	err = tlv.SetMode(tlv493d.LowPowerMode)
	if err != nil {
		return nil, errors.Wrap(err, "set mode")
	}

	sensor := TlvSensor{tlv: tlv}
	reading, err := sensor.Read()
	if err != nil {
		return nil, errors.Wrap(err, "read initial value")
	}

	logger.Info(
		"initial magnetic field reading",
		zap.Float64("bx", reading.Bx),
		zap.Float64("by", reading.By),
		zap.Float64("bz", reading.Bz),
		zap.Float64("b", reading.B),
		zap.Float64("temperature", reading.Temperature),
	)

	return &sensor, nil
}

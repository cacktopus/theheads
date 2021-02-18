package main

import (
	"encoding/binary"
	"fmt"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"gobot.io/x/gobot/sysfs"
	"time"

	"gobot.io/x/gobot/drivers/i2c"
)

var gVoltage = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Namespace: "power_monitor",
	Name:      "voltage",
	Help:      "Voltage (V)",
}, []string{"address"})

var gCurrent = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Namespace: "power_monitor",
	Name:      "current",
	Help:      "Current (A)",
}, []string{"address"})

var gPower = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Namespace: "power_monitor",
	Name:      "power",
	Help:      "Power (W)",
}, []string{"address"})

func init() {
	prometheus.MustRegister(gVoltage)
	prometheus.MustRegister(gCurrent)
	prometheus.MustRegister(gPower)
}

func main() {
	logger, _ := zap.NewProduction()

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger:    logger,
		Port:      8083,
		GrpcSetup: nil,
		HttpSetup: nil,
	})
	if err != nil {
		panic(err)
	}

	device, err := sysfs.NewI2cDevice("/dev/i2c-1")
	if err != nil {
		panic(err)
	}

	address := 0x40
	connection := i2c.NewConnection(device, 0x40)

	const (
		regCurrent    = 0x01
		regBusVoltage = 0x02
		regPower      = 0x03
	)

	go func() {
		t := time.NewTicker(5 * time.Second)

		for range t.C {
			// Read values from sensor.

			read16 := func(reg byte) (uint16, error) {
				data, err := connection.ReadWordData(reg)
				if err != nil {
					panic(err)
				}

				var buf [2]byte

				binary.BigEndian.PutUint16(buf[:], data)
				data2 := binary.LittleEndian.Uint16(buf[:])

				return data2, nil
			}

			voltage16, err := read16(regBusVoltage)
			if err != nil {
				panic(err)
			}

			current16, err := read16(regCurrent)
			if err != nil {
				panic(err)
			}

			power16, err := read16(regPower)
			if err != nil {
				panic(err)
			}

			voltage := 0.00125 * float64(voltage16)
			current := 0.00125 * float64(current16) // TODO: two's compliment fix?
			power := 0.01 * float64(power16)

			strAddr := fmt.Sprintf("0x%x", address)

			gVoltage.WithLabelValues(strAddr).Set(voltage)
			gCurrent.WithLabelValues(strAddr).Set(current)
			gPower.WithLabelValues(strAddr).Set(power)
		}
	}()

	panic(server.Run())
}

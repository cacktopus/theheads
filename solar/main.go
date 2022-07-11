package solar

import (
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/spagettikod/gotracer"
	"go.uber.org/zap"
	"math"
	"sync"
	"time"
)

func simpleGaugeFunc(name string, callback func() float64) prometheus.GaugeFunc {
	g := prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "solar",
		Name:      name,
	}, func() float64 {
		return callback()
	})
	prometheus.MustRegister(g)
	return g
}

var opt struct {
	SerialPort string `long:"serial-port" env:"SERIAL_PORT" default:"/dev/ttyXRUSB0"`
	Port       int    `long:"port" env:"PORT" default:"8089"`
}

func Run() error {
	logger, _ := zap.NewProduction()

	_, err := flags.Parse(&opt)
	if err != nil {
		return errors.Wrap(err, "parse")
	}

	_, err = gotracer.Status(opt.SerialPort)
	if err != nil {
		return errors.Wrap(err, "initial status")
	}

	SetupStats(logger)

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger:    logger,
		Port:      opt.Port,
		GrpcSetup: nil,
		HttpSetup: nil,
	})
	if err != nil {
		return errors.Wrap(err, "new server")
	}

	return errors.Wrap(server.Run(), "run server")
}

func SetupStats(logger *zap.Logger) {
	debounce := NewDebouncer()
	var lock sync.Mutex
	var status gotracer.TracerStatus
	var statusErr error

	read := func(callback func(status *gotracer.TracerStatus) float64) float64 {
		debounce.Debounce("read", 2*time.Second, func() {
			func() {
				lock.Lock()
				defer lock.Unlock()
				logger.Info("calling status")
				status, statusErr = gotracer.Status(opt.SerialPort)
				if statusErr != nil {
					logger.Info("error reading status", zap.Error(statusErr))
				}
			}()
		})

		var currentStatus gotracer.TracerStatus
		var currentErr error
		func() {
			lock.Lock()
			defer lock.Unlock()
			currentErr = statusErr
			currentStatus = status // copy current state
		}()

		if currentErr != nil {
			return math.NaN()
		} else {
			return callback(&currentStatus)
		}
	}

	newStat := func(name string, f func(status *gotracer.TracerStatus) float64) {
		simpleGaugeFunc(name, func() float64 {
			return read(f)
		})
	}

	newStat("array_voltage", func(status *gotracer.TracerStatus) float64 {
		return float64(status.ArrayVoltage)
	})

	newStat("array_power", func(status *gotracer.TracerStatus) float64 {
		return float64(status.ArrayPower)
	})

	newStat("array_current", func(status *gotracer.TracerStatus) float64 {
		return float64(status.ArrayCurrent)
	})

	newStat("battery_voltage", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryVoltage)
	})

	newStat("battery_current", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryCurrent)
	})

	newStat("battery_state_of_charge", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatterySOC)
	})

	newStat("battery_temperature_celsius", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryTemp)
	})

	newStat("battery_temperature_fahrenheit", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryTemp)*9.0/5.0 + 32.0
	})

	newStat("load_voltage", func(status *gotracer.TracerStatus) float64 {
		return float64(status.LoadVoltage)
	})

	newStat("load_current", func(status *gotracer.TracerStatus) float64 {
		return float64(status.LoadCurrent)
	})

	newStat("load_power", func(status *gotracer.TracerStatus) float64 {
		return float64(status.LoadPower)
	})

	newStat("device_temperature_celsius", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryTemp)
	})

	newStat("device_temperature_fahrenheit", func(status *gotracer.TracerStatus) float64 {
		return float64(status.BatteryTemp)*9.0/5.0 + 32.0
	})
}

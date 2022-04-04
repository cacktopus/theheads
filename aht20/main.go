package main

import (
	"github.com/cacktopus/theheads/aht20/driver"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"math"
	"os"
	"time"
)

func main() {
	labels := map[string]string{}
	location := os.Getenv("LOCATION")
	if location != "" {
		labels["location"] = location
	}

	gTempCelsius := prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace:   "aht20",
		Name:        "temperature_celsius",
		Help:        "Temperature (C)",
		ConstLabels: labels,
	})
	gTempCelsius.Set(math.NaN())
	prometheus.MustRegister(gTempCelsius)

	gTemperatureFahrenheit := prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace:   "aht20",
		Name:        "temperature_fahrenheit",
		Help:        "Temperature (F)",
		ConstLabels: labels,
	})

	gTemperatureFahrenheit.Set(math.NaN())
	prometheus.MustRegister(gTemperatureFahrenheit)

	gRelativeHumidity := prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace:   "aht20",
		Name:        "relative_humidity",
		Help:        "Relative Humidity (%)",
		ConstLabels: labels,
	})
	gRelativeHumidity.Set(math.NaN())
	prometheus.MustRegister(gRelativeHumidity)

	logger, _ := zap.NewProduction()

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger:    logger,
		Port:      8087,
		GrpcSetup: nil,
		HttpSetup: nil,
	})
	if err != nil {
		panic(err)
	}

	driver, err := driver.New()
	if err != nil {
		panic(err)
	}

	time.Sleep(20 * time.Millisecond)

	err = driver.Reset()
	if err != nil {
		panic(errors.Wrap(err, "reset"))
	}

	err = driver.Calibrate()
	if err != nil {
		panic(errors.Wrap(err, "calibrate"))
	}

	go func() {
		for {
			data, err := driver.Read()
			if err != nil {
				panic(err)
			}

			//fmt.Println(time.Now().String(), data.Temp, data.Humidity)

			gTempCelsius.Set(data.Temp)
			gTemperatureFahrenheit.Set(data.Temp*9.0/5.0 + 32.0)
			gRelativeHumidity.Set(data.Humidity)

			time.Sleep(2 * time.Second)
		}
	}()

	panic(server.Run())
}

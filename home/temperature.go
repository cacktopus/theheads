package main

import (
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"io/ioutil"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

var temperatures = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Namespace: "rpi",
	Subsystem: "cpu",
	Name:      "temp_degrees",
}, []string{"zone"})

func init() {
	prometheus.MustRegister(temperatures)
}

func monitorTemperatures(errCh chan error) {
	ticker := time.NewTicker(5 * time.Second)
	for range ticker.C {
		files, err := filepath.Glob("/sys/class/thermal/*/temp")
		if err != nil {
			errCh <- errors.Wrap(err, "glob")
			return
		}

		for _, file := range files {
			content, err := ioutil.ReadFile(file)
			if err != nil {
				errCh <- errors.Wrap(err, "readfile")
				return
			}

			val, err := strconv.Atoi(strings.TrimSpace(string(content)))
			if err != nil {
				errCh <- errors.Wrap(err, "atoi")
				return
			}

			parts := strings.Split(file, "/")
			zone := parts[len(parts)-2]

			temperatures.WithLabelValues(zone).Set(float64(val) / 1000)
		}
	}
}

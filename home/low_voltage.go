package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

/*
https://raspberrypi.stackexchange.com/questions/60593/how-raspbian-detects-under-voltage

Bit Hex value   Meaning
0          1    Under-voltage detected
1          2    Arm frequency capped
2          4    Currently throttled
3          8    Soft temperature limit active
16     10000    Under-voltage has occurred
17     20000    Arm frequency capping has occurred
18     40000    Throttling has occurred
19     80000    Soft temperature limit has occurred
*/

var lowVoltageObserved = prometheus.NewGauge(prometheus.GaugeOpts{
	Namespace: "rpi",
	Subsystem: "power",
	Name:      "low_voltage_observed",
})

func init() {
	prometheus.MustRegister(lowVoltageObserved)
}

func monitorLowVoltage(logger *zap.Logger, errCh chan error) {
	ticker := time.NewTicker(5 * time.Second)
	for range ticker.C {
		cmd := exec.Command("vcgencmd", "get_throttled")
		buf, err := cmd.CombinedOutput()
		output := string(buf)
		if err != nil {
			logger.Error(
				"vcgencmd error",
				zap.Error(err),
				zap.String("output", output),
			)
			continue
		}

		parts := strings.Split(strings.TrimSpace(output), "=")
		if len(parts) != 2 {
			logger.Error("vcgencmd invalid output", zap.String("output", output))
			continue
		}

		val, err := strconv.ParseInt(parts[1][2:], 16, 64)
		if err != nil {
			logger.Error("vcgencmd parse error", zap.Error(err))
			continue
		}

		underVoltage := val&0x10000 > 0

		if underVoltage {
			lowVoltageObserved.Set(1)
		} else {
			lowVoltageObserved.Set(0)
		}
	}
}

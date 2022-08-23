package web

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"os/exec"
	"strconv"
	"strings"
	"sync/atomic"
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

func monitorLowVoltage(logger *zap.Logger, errCh chan error) {
	ticker := time.NewTicker(5 * time.Second)
	var throttled uint64

	gaugeFunc := func(name string, mask uint64) {
		promauto.NewGaugeFunc(prometheus.GaugeOpts{
			Namespace: "rpi",
			Subsystem: "power",
			Name:      name,
		}, func() float64 {
			val := atomic.LoadUint64(&throttled)
			if val&mask != 0 {
				return 1.0
			}
			return 0.0
		})
	}

	gaugeFunc("low_voltage_now", 0x1)
	gaugeFunc("frequency_capped_now", 0x2)
	gaugeFunc("throttled_now", 0x4)
	gaugeFunc("soft_temperature_limit_now", 0x8)

	gaugeFunc("low_voltage_observed", 0x10000)
	gaugeFunc("frequency_capped_observed", 0x20000)
	gaugeFunc("throttled_observed", 0x40000)
	gaugeFunc("soft_temperature_limit_observed", 0x80000)

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

		atomic.StoreUint64(&throttled, uint64(val))
	}
}

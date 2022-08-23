package camera_feed

import "github.com/prometheus/client_golang/prometheus"

var (
	gBrightnessMean = prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "boss",
		Name:      "brightness_mean",
	})

	gBrightnessCameraCount = prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "boss",
		Name:      "brightness_camera_count",
	})
)

func init() {
	prometheus.MustRegister(
		gBrightnessMean,
		gBrightnessCameraCount,
	)
}

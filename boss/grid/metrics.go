package grid

import "github.com/prometheus/client_golang/prometheus"

var activeFocalPointCount = prometheus.NewGauge(prometheus.GaugeOpts{
	Namespace: "heads",
	Subsystem: "boss",
	Name:      "active_focal_points",
})

func init() {
	prometheus.MustRegister(activeFocalPointCount)
}
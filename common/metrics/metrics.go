package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/collectors"
)

func NewRegistry() *prometheus.Registry {
	registry := prometheus.NewRegistry()

	registry.MustRegister(collectors.NewProcessCollector(collectors.ProcessCollectorOpts{}))
	registry.MustRegister(collectors.NewGoCollector())

	return registry
}

func SimpleGauge(registerer prometheus.Registerer, subsystem, name string) prometheus.Gauge {
	g := prometheus.NewGauge(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: subsystem,
		Name:      name,
	})
	registerer.MustRegister(g)
	return g
}

func SimpleCounter(registerer prometheus.Registerer, subsystem, name string) prometheus.Counter {
	c := prometheus.NewCounter(prometheus.CounterOpts{
		Namespace: "heads",
		Subsystem: subsystem,
		Name:      name,
	})
	registerer.MustRegister(c)
	return c
}

package util

import (
	"github.com/prometheus/client_golang/prometheus"
	"gocv.io/x/gocv"
	"time"
)

type CPUTimer struct {
	times      map[string]time.Duration
	tickCounts *prometheus.CounterVec
}

func NewCPUTimer(registry prometheus.Registerer) *CPUTimer {
	tickCounts := prometheus.NewCounterVec(prometheus.CounterOpts{
		Name: "heads_camera_cpu_ticks",
	}, []string{"section"})
	registry.MustRegister(tickCounts)

	freq := gocv.GetTickFrequency()
	registry.MustRegister(prometheus.NewCounterFunc(prometheus.CounterOpts{
		Name: "heads_camera_cpu_tick_frequency",
	}, func() float64 {
		return freq
	}))

	return &CPUTimer{
		times:      make(map[string]time.Duration),
		tickCounts: tickCounts,
	}
}

func (t *CPUTimer) T(section string, f func()) {
	if _, ok := t.times[section]; !ok {
		t.times[section] = 0
	}
	start := time.Now()
	startTicks := gocv.GetTickCount()
	f()
	stopTicks := gocv.GetTickCount()
	delta := float64(stopTicks - startTicks)
	t.tickCounts.With(prometheus.Labels{"section": section}).Add(delta)
	t.times[section] += time.Since(start)
}

var ()

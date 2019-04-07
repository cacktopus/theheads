package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"gocv.io/x/gocv"
	"time"
)

func t(section string, f func()) {
	if _, ok := times[section]; !ok {
		times[section] = 0
	}
	start := time.Now()
	startTicks := gocv.GetTickCount()
	f()
	stopTicks := gocv.GetTickCount()
	delta := float64(stopTicks - startTicks)
	tickCounts.With(prometheus.Labels{"section": section}).Add(delta)
	times[section] += time.Since(start)
}

var times = make(map[string]time.Duration)

var (
	frameProcessed = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_camera_frame_processed",
	})

	tickCounts = promauto.NewCounterVec(prometheus.CounterOpts{
		Name: "heads_camera_cpu_ticks",
	}, []string{"section"})
)

func init() {
	freq := gocv.GetTickFrequency()
	promauto.NewCounterFunc(prometheus.CounterOpts{
		Name: "heads_camera_cpu_tick_frequency",
	}, func() float64 {
		return freq
	})
}

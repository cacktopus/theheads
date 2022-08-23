package app

import (
	"github.com/cacktopus/theheads/boss/day"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/services"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"io/fs"
)

type Boss struct {
	Logger      *zap.Logger
	Env         *Cfg
	Broker      *broker.Broker
	Grid        *grid.Grid
	Directory   *services.Directory
	Server      *standard_server.Server
	Scene       *scene.Scene
	Frontend    fs.FS
	DayDetector day.Detector
	HeadManager *head_manager.HeadManager
}

func (b *Boss) SetupMetrics() {
	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "boss",
		Name:      "is_day",
	}, func() float64 {
		if b.DayDetector.IsDay() {
			return 1.0
		}
		return 0.0
	}))

	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "boss",
		Name:      "fearful_heads",
	}, func() float64 {
		result := 0.0
		for _, head := range b.Scene.Heads {
			if head.Fearful() {
				result += 1.0
			}
		}
		return result
	}))
}

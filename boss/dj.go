package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"time"
)

type SceneRunner func(
	ctx context.Context,
	dj *DJ,
	done util.BroadcastCloser,
	logger *zap.Logger,
)

type SceneConfig struct {
	Runner           SceneRunner
	MaxLengthSeconds uint
}

var currentSceneMetric = prometheus.NewGaugeVec(prometheus.GaugeOpts{
	Namespace: "heads",
	Subsystem: "boss",
	Name:      "scene_running",
}, []string{
	"scene",
})

func init() {
	prometheus.MustRegister(currentSceneMetric)
}

type DJ struct {
	logger      *zap.Logger
	grid        *grid.Grid
	scene       *scene.Scene
	texts       []*scene.Text
	headManager *head_manager.HeadManager
}

func (dj *DJ) RunScenes() {
	sceneNumber := 1
	for ; ; sceneNumber++ {
		for _, sceneName := range dj.scene.Scenes {
			dj.runScene(sceneName, sceneNumber)
		}
	}
}

func (dj *DJ) runScene(sceneName string, sceneNumber int) {
	logger := dj.logger.With(zap.String("scene", sceneName), zap.Int("number", sceneNumber))
	logger.Info("Running Scene")
	done := util.NewBroadcastCloser()
	defer done.Close()
	defer dj.headManager.Close()

	sc := AllScenes[sceneName]
	maxLength := time.Duration(sc.MaxLengthSeconds) * time.Second

	ctx, cancel := context.WithTimeout(context.Background(), maxLength)
	defer cancel()

	dj.headManager.CheckIn(ctx, dj.scene.HeadNames())

	go func(sceneName string) {
		currentSceneMetric.WithLabelValues(sceneName).Inc()
		sc.Runner(ctx, dj, done, logger)
		currentSceneMetric.WithLabelValues(sceneName).Dec()
	}(sceneName)

	dj.Sleep(done, maxLength)
}

func (dj *DJ) Sleep(done util.BroadcastCloser, duration time.Duration) bool {
	select {
	case <-time.After(duration):
		return false
	case <-done.Chan():
		return true
	}
}

var followConvo = FollowConvo{}

var AllScenes = map[string]SceneConfig{
	"find_zeros":       {FindZeros, 30},
	"follow_convo":     {followConvo.Run, 5 * 60},
	"idle":             {Idle, 60},
	"boss_restarter":   {BossRestarter, 10},
	"camera_restarter": {CameraRestarter, 10},
}

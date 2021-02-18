package boss

import (
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"time"
)

type SceneRunner func(dj *DJ, done util.BroadcastCloser, logger *zap.Logger)

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
			logger := dj.logger.With(zap.String("scene", sceneName), zap.Int("number", sceneNumber))
			logger.Info("Running Scene")
			done := util.NewBroadcastCloser()

			dj.headManager.CheckIn(dj.scene.HeadNames())

			sc := AllScenes[sceneName]
			go func(sceneName string) {
				currentSceneMetric.WithLabelValues(sceneName).Inc()
				sc.Runner(dj, done, logger)
				currentSceneMetric.WithLabelValues(sceneName).Dec()
			}(sceneName)
			maxLength := time.Duration(sc.MaxLengthSeconds) * time.Second
			dj.Sleep(done, maxLength)
			done.Close()
			dj.headManager.Close()
		}
	}
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
	"in_n_out":         {InNOut, 60},
	"follow_evade":     {FollowEvade, 60},
	"conversation":     {Conversation, 5 * 60},
	"find_zeros":       {FindZeros, 30},
	"follow_convo":     {followConvo.Run, 5 * 60},
	"idle":             {Idle, 60},
	"random":           {Random, 120},
	"boss_restarter":   {BossRestarter, 10},
	"camera_restarter": {CameraRestarter, 10},
}

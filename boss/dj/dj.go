package dj

import (
	"context"
	"github.com/cacktopus/theheads/boss/app"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/services"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"time"
)

type SceneParams struct {
	Ctx    context.Context
	Logger *zap.Logger
	Done   util.BroadcastCloser
	DJ     *DJ
}

func (sp *SceneParams) WithLogger(logger *zap.Logger) *SceneParams {
	result := *sp
	result.Logger = logger
	return &result
}

func (sp *SceneParams) WithContext(ctx context.Context) *SceneParams {
	result := *sp
	result.Ctx = ctx
	return &result
}

type SceneRunner func(params *SceneParams)

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
	Logger      *zap.Logger
	Grid        *grid.Grid
	Scene       *scene.Scene
	HeadManager *head_manager.HeadManager
	Directory   *services.Directory
	AllScenes   map[string]SceneConfig
	Boss        *app.Boss

	FloodlightController func() bool

	interrupted *atomic.String
}

func NewDJ(
	boss *app.Boss,
	allScenes map[string]SceneConfig,
) *DJ {
	return &DJ{
		Logger:      boss.Logger,
		Grid:        boss.Grid,
		Scene:       boss.Scene,
		HeadManager: boss.HeadManager,
		Directory:   boss.Directory,
		AllScenes:   allScenes,

		FloodlightController: boss.FloodlightControl,

		interrupted: atomic.NewString(""),

		Boss: boss,
	}
}

func (dj *DJ) RunScenes() {
	sceneNumber := 1

	for _, sceneName := range dj.Scene.StartupScenes {
		dj.runScene(sceneName, sceneNumber)
		sceneNumber++
	}

	for ; ; sceneNumber++ {
		for _, sceneName := range dj.Scene.Scenes {
			dj.runScene(sceneName, sceneNumber)

			// maybe runScene can return if it was interrupted
			interrupted := dj.interrupted.Load()
			if interrupted != "" {
				dj.Logger.Info("scene was interrupted", zap.String("new_scene", interrupted))
				dj.interrupted.Store("")
				sceneNumber++
				dj.runScene(interrupted, sceneNumber)
			}
		}
	}
}

func (dj *DJ) runScene(sceneName string, sceneNumber int) {
	logger := dj.Logger.With(zap.String("scene_name", sceneName), zap.Int("scene_number", sceneNumber))
	logger.Info("Running Scene")
	done := util.NewBroadcastCloser()
	defer done.Close()

	sc := dj.AllScenes[sceneName]
	maxLength := time.Duration(sc.MaxLengthSeconds) * time.Second

	ctx, cancel := context.WithTimeout(context.Background(), maxLength)
	defer cancel()

	sp := &SceneParams{
		Ctx:    ctx,
		Logger: logger,
		Done:   done,
		DJ:     dj,
	}

	go func(sceneName string) {
		currentSceneMetric.WithLabelValues(sceneName).Inc()
		sc.Runner(sp)
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

func (dj *DJ) InterruptWithScene(done util.BroadcastCloser, sceneName string) {
	dj.interrupted.Store(sceneName)
	done.Close()
}

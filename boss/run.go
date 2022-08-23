package boss

import (
	"embed"
	"github.com/cacktopus/theheads/boss/app"
	"github.com/cacktopus/theheads/boss/day"
	"github.com/cacktopus/theheads/boss/day/camera_feed"
	"github.com/cacktopus/theheads/boss/day/time_based"
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/scenes/basic"
	"github.com/cacktopus/theheads/boss/scenes/find_zeros"
	"github.com/cacktopus/theheads/boss/scenes/follow_convo"
	"github.com/cacktopus/theheads/boss/scenes/freakout"
	"github.com/cacktopus/theheads/boss/server"
	"github.com/cacktopus/theheads/boss/services"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"go.uber.org/zap"
	"io/fs"
	"os"
	"strconv"
)

//go:embed frontend/fe
var fe embed.FS

func Run(env *app.Cfg, discovery discovery.Discovery) {
	boss := &app.Boss{
		Env: env,
	}

	util.SetRandSeed()

	var err error

	boss.Logger, err = util.NewLogger(env.Debug)
	if err != nil {
		panic(err)
	}

	go watchdog.Watch(boss.Logger)

	boss.Broker = broker.NewBroker()
	go boss.Broker.Start()

	boss.Scene, err = scene.BuildInstallation(env.ScenePath, env.SceneName, env.TextSet)
	if err != nil {
		panic(err)
	}

	boss.Grid = grid.NewGrid(
		boss.Logger,
		env.SpawnPeriod,
		-10, -10, 10, 10,
		400, 400,
		boss.Scene,
		boss.Broker,
	)
	go boss.Grid.Start()

	eventStremer := services.NewEventStreamer(boss.Logger, discovery, boss.Broker)
	go eventStremer.Stream("head")
	go eventStremer.Stream("camera")

	boss.Directory = services.NewDirectory(boss.Logger, discovery)
	if err := boss.Directory.Run(); err != nil {
		panic(err)
	}

	if env.BossFE != "" {
		boss.Logger.Info("loading frontend from filesystem", zap.String("path", env.BossFE))
		// TODO: some checking on contents of env.BossFE directory
		boss.Frontend = os.DirFS(env.BossFE)
	} else {
		sub, err := fs.Sub(fe, "frontend/fe")
		if err != nil {
			panic(err)
		}
		boss.Frontend = sub
	}

	boss.Server, err = server.SetupRoutes(boss) // TODO: just pass boss?
	if err != nil {
		panic(err)
	}

	{
		controller, args := env.DayDetector[0], env.DayDetector[1:]
		var detector day.Detector
		switch controller {
		case "time-based":
			detector = time_based.NewDetector(args...)
		case "camera-feed":
			threshold, err := strconv.ParseFloat(args[0], 64)
			if err != nil {
				panic(err)
			}
			d := camera_feed.NewDetector(boss.Broker, threshold)
			go d.Run()
			detector = d
		default:
			panic("unknown day detector")
		}
		boss.DayDetector = detector
	}

	go boss.ProcessEvents()

	boss.SetupMetrics()

	go func() {
		panic(boss.Server.Run())
	}()

	var followConvo = &follow_convo.FollowConvo{}
	var allScenes = map[string]dj.SceneConfig{
		"boss_restarter":   {basic.BossRestarter, 10},
		"camera_restarter": {basic.CameraRestarter, 10},
		"find_zeros":       {find_zeros.FindZeros, 30},
		"follow_convo":     {followConvo.Run, 5 * 60},
		"idle":             {basic.Idle, 60},
		"freakout":         {freakout.Freakout, 60},
	}

	boss.HeadManager = head_manager.NewHeadManager(boss.Logger, boss.Directory)

	dj.NewDJ(boss, allScenes).RunScenes()
}

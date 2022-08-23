package main

import (
	"github.com/cacktopus/theheads/boss"
	util2 "github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/camera"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/head"
	"github.com/cacktopus/theheads/web"
	"github.com/gin-gonic/gin"
	"github.com/ory/dockertest/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

const dockerCamera = false

func main() {
	logger, _ := zap.NewProduction()
	gin.SetMode(gin.ReleaseMode)

	var wg sync.WaitGroup
	wg.Add(1)
	done := util2.NewBroadcastCloser()

	services := &discovery.StaticDiscovery{}

	if dockerCamera {
		pool, err := dockertest.NewPool("")
		if err != nil {
			panic(errors.Wrap(err, "could not connect to docker"))
		}

		wg.Add(1)
		camera01Port := runDockerCamera(logger, done, &wg, pool, "camera-01", "/d/pi43.raw")
		services.Register("camera", "camera-01", camera01Port)
		wg.Add(1)
		camera02Port := runDockerCamera(logger, done, &wg, pool, "camera-02", "/d/pi42.raw")
		services.Register("camera", "camera-02", camera02Port)
	} else {
		wg.Add(1)
		camera01Cfg := cameraEnv("camera-01", "dev/pi42.raw")
		services.Register("camera", "camera-01", camera01Cfg.Port)
		go camera.Run(camera01Cfg)

		wg.Add(1)
		camera02Cfg := cameraEnv("camera-02", "dev/pi43.raw")
		services.Register("camera", "camera-02", camera02Cfg.Port)
		go camera.Run(camera02Cfg)
	}

	head01 := headEnv("head-01")
	services.Register("head", head01.Instance, head01.Port)

	head02 := headEnv("head-02")
	services.Register("head", head02.Instance, head02.Port)

	boss01 := bossEnv()
	services.Register("boss", "boss01", 8081)

	go head.Run(head01)
	go head.Run(head02)

	fakeleds01Port := util.RandomPort()
	(&fakeleds{}).Run(fakeleds01Port)
	services.Register("leds", "head-01", fakeleds01Port)

	fakeleds02Port := util.RandomPort()
	(&fakeleds{}).Run(fakeleds02Port)
	services.Register("leds", "head-02", fakeleds02Port)

	time.Sleep(50 * time.Millisecond)

	go boss.Run(boss01, services)

	services.Register("web", "web01", 80)
	go func() {
		err := web.Run(services)
		if err != nil {
			panic(err)
		}
	}()

	sigc := make(chan os.Signal, 1)
	signal.Notify(sigc,
		//syscall.SIGTERM,
		syscall.SIGINT,
	)

	go func() {
		<-sigc
		wg.Done()
		done.Close()
	}()

	wg.Wait()
}

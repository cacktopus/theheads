package main

import (
	"bufio"
	"github.com/cacktopus/theheads/boss"
	util2 "github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/head"
	"github.com/cacktopus/theheads/head/cfg"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/voices"
	"github.com/gin-gonic/gin"
	"github.com/ory/dockertest/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io"
	"os"
	"os/signal"
	"strconv"
	"sync"
	"syscall"
	"time"
)

func headEnv(name string) *cfg.Cfg {
	env := &cfg.Cfg{
		Instance:    name,
		Port:        util.RandomPort(),
		FakeStepper: true,
		SensorPin:   0,
		Motor: motor.Cfg{
			NumSteps:              200,
			StepSpeed:             30,
			DirectionChangePauses: 10,
		},
		Voices: voices.Cfg{
			MediaPath: os.ExpandEnv("$HOME/shared/theheads/voices"),
		},
	}
	return env
}

func bossEnv() *boss.Cfg {
	scenePath := os.ExpandEnv("dev/scenes/two-heads")

	boss01 := &boss.Cfg{
		ScenePath: scenePath,
		BossFE:    os.Getenv("BOSS_FE"),
	}
	return boss01
}

func runCamera(
	logger *zap.Logger,
	done util2.BroadcastCloser,
	wg *sync.WaitGroup,
	pool *dockertest.Pool,
	instance, filename string,
) int {
	camera, err := pool.RunWithOptions(&dockertest.RunOptions{
		Repository:   "camera-amd64",
		Tag:          "latest",
		Cmd:          []string{"/bin/sleep", "60000"},
		Mounts:       []string{os.ExpandEnv("$PWD/dev") + ":/d"},
		ExposedPorts: []string{"5000"},
	})

	if err != nil {
		panic(errors.Wrap(err, "could not start resource"))
	}

	strPort := camera.GetPort("5000/tcp")
	port, err := strconv.Atoi(strPort)
	if err != nil {
		panic(err)
	}

	logger.Info("camera port", zap.Int("port", port))

	go func() {
		rOut, wOut := io.Pipe()
		rErr, wErr := io.Pipe()

		go func() {
			s := bufio.NewScanner(rOut)
			for s.Scan() {
				os.Stdout.Write(append(s.Bytes(), '\n'))
			}
		}()

		go func() {
			s := bufio.NewScanner(rErr)
			for s.Scan() {
				os.Stdout.Write(append(s.Bytes(), '\n'))
			}
		}()

		_, err := camera.Exec([]string{"/build/app/camera"}, dockertest.ExecOptions{
			Env: []string{
				"INSTANCE=" + instance,
				"FILENAME=" + filename,
				"DRAW_FRAME=roi",
				"ROI=0,50,0,50",
				"FLOODLIGHT_PIN=-1",
			},
			StdOut: wOut,
			StdErr: wErr,
			TTY:    false,
		})

		if err != nil {
			panic(errors.Wrap(err, "exec"))
		}

		logger.Info("camera exited", zap.String("instance", instance))
		wg.Done()
	}()

	go func() {
		<-done.Chan()
		logger.Info("closing camera", zap.String("instance", instance))
		camera.Close()
	}()

	return port
}

func main() {
	logger, _ := zap.NewProduction()
	gin.SetMode(gin.ReleaseMode)

	var wg sync.WaitGroup
	wg.Add(1)
	done := util2.NewBroadcastCloser()

	services := &discovery.StaticDiscovery{}

	if true {
		pool, err := dockertest.NewPool("")
		if err != nil {
			panic(errors.Wrap(err, "could not connect to docker"))
		}

		wg.Add(1)
		camera01Port := runCamera(logger, done, &wg, pool, "camera-01", "/d/pi43.raw")
		services.Register("camera", "camera-01", camera01Port)
		wg.Add(1)
		camera02Port := runCamera(logger, done, &wg, pool, "camera-02", "/d/pi42.raw")
		services.Register("camera", "camera-02", camera02Port)
	}

	head01 := headEnv("head-01")
	services.Register("head", head01.Instance, head01.Port)

	head02 := headEnv("head-02")
	services.Register("head", head02.Instance, head02.Port)

	boss01 := bossEnv()

	go head.Run(head01)
	go head.Run(head02)

	time.Sleep(50 * time.Millisecond)

	go boss.Run(boss01, services)

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

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
		Repository:   "camera",
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

		_, err := camera.Exec([]string{"/app/camera"}, dockertest.ExecOptions{
			Env: []string{
				"INSTANCE=" + instance,
				"FILENAME=" + filename,
				"DRAW_FRAME=roi",
				"ROI=0,50,0,50",
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
	done := util2.NewBroadcastCloser()

	services := discovery.NewStaticDiscovery()

	pool, err := dockertest.NewPool("")
	if err != nil {
		panic(errors.Wrap(err, "could not connect to docker"))
	}

	wg.Add(1)
	camera01Port := runCamera(logger, done, &wg, pool, "camera-01", "/d/pi43.raw")
	wg.Add(1)
	camera02Port := runCamera(logger, done, &wg, pool, "camera-02", "/d/pi42.raw")

	head01 := headEnv("head-01")
	head02 := headEnv("head-02")
	boss01 := bossEnv()

	go head.Run(head01)
	go head.Run(head02)
	go boss.Run(boss01, services)

	services.Register("_head._tcp", head01.Instance, head01.Port)
	services.Register("_head._tcp", head02.Instance, head02.Port)

	services.Register("_camera._tcp", "camera-01", camera01Port)
	services.Register("_camera._tcp", "camera-02", camera02Port)

	sigc := make(chan os.Signal, 1)
	signal.Notify(sigc,
		//syscall.SIGTERM,
		syscall.SIGINT,
	)

	go func() {
		<-sigc
		done.Close()
	}()

	wg.Wait()
}

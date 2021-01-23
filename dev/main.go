package main

import (
	"github.com/cacktopus/theheads/boss"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/head"
	"github.com/cacktopus/theheads/head/cfg"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/voices"
	"os"
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
	scenePath := os.ExpandEnv("$HOME/shared/theheads/scenes/hb2021")

	boss01 := &boss.Cfg{
		ScenePath: scenePath,
	}
	return boss01
}

func main() {
	services := discovery.NewStaticDiscovery()

	head01 := headEnv("head-01")
	head02 := headEnv("head-02")
	boss01 := bossEnv()

	go head.Run(head01)
	go head.Run(head02)
	go boss.Run(boss01, services)

	time.Sleep(500 * time.Millisecond)

	services.Register("_head._tcp", head01.Instance, head01.Port)
	services.Register("_head._tcp", head02.Instance, head02.Port)

	services.Register("_camera._tcp", "camera-01", 5010)
	services.Register("_camera._tcp", "camera-02", 5011)

	go services.Run()

	select {}
}

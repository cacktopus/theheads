package main

import (
	"github.com/cacktopus/theheads/boss"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/vrischmann/envconfig"
)

func main() {
	env := &boss.Cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	boss.Run(env, discovery.MDNSDiscovery{})
}

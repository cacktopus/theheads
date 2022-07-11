package main

import (
	"github.com/cacktopus/theheads/head"
	"github.com/cacktopus/theheads/head/cfg"
	"github.com/vrischmann/envconfig"
)

func main() {
	env := &cfg.Cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	head.Run(env)
}

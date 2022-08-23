package main

import (
	"github.com/cacktopus/theheads/boss"
	"github.com/cacktopus/theheads/boss/app"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/pkg/errors"
	"github.com/vrischmann/envconfig"
)

func run() error {
	env := &app.Cfg{}

	err := envconfig.Init(env)
	if err != nil {
		return errors.Wrap(err, "init env")
	}

	boss.Run(env, discovery.NewSerf("127.0.0.1:7373"))
	return nil
}

func main() {
	err := run()
	if err != nil {
		panic(err)
	}
}

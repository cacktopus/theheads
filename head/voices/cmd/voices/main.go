package main

import (
	"github.com/cacktopus/theheads/voices"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
)

func main() {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	cfg := &voices.Cfg{}

	err = envconfig.Init(cfg)
	if err != nil {
		panic(err)
	}

	s := voices.NewServer(cfg, logger)
	err = s.Setup()
	if err != nil {
		panic(err)
	}
	go s.Serve()
	select {}
}

package main

import (
	"github.com/vrischmann/envconfig"
	"raftsync/server"
)

func main() {
	cfg := &server.Cfg{}

	err := envconfig.Init(cfg)
	if err != nil {
		panic(err)
	}

	server.RunServer(cfg)
}

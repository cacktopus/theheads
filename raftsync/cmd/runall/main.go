package main

import (
	"raftdemo/server"
)

// On MacOS, `ifconfig lo0 alias 127.0.0.2`

var (
	hosts   = []string{"127.0.0.1", "127.0.0.2", "127.0.0.3"}
	buckets = []string{"theheads", "other"}
)

func main() {
	cfg1 := &server.Cfg{
		Hosts:   hosts,
		Host:    hosts[0],
		DataDir: "runall-data/data1",
		Buckets: buckets,
	}

	cfg2 := &server.Cfg{
		Hosts:   hosts,
		Host:    hosts[1],
		DataDir: "runall-data/data2",
		Buckets: buckets,
	}

	cfg3 := &server.Cfg{
		Hosts:   hosts,
		Host:    hosts[2],
		DataDir: "runall-data/data3",
		Buckets: buckets,
	}

	go server.RunServer(cfg1)
	go server.RunServer(cfg2)
	go server.RunServer(cfg3)

	select {}
}

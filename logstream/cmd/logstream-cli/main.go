package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/grandcat/zeroconf"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"strings"
)

type log struct {
	Hostname         string `json:"_HOSTNAME"`
	Unit             string `json:"UNIT"`
	SyslogIdentifier string `json:"SYSLOG_IDENTIFIER"`
	SystemdUnit      string `json:"_SYSTEMD_UNIT"`
	Message          string `json:"MESSAGE"`
}

func main() {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	ch := make(chan string)

	discovery.MDNSDiscovery{}.Discover(
		logger,
		context.Background(),
		"_logstream._tcp",
		func(entry *zeroconf.ServiceEntry) {
			addr := fmt.Sprintf("%s:%d", strings.TrimSuffix(entry.HostName, "."), entry.Port)

			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			if err != nil {
				panic(err)
			}
			client := gen.NewLogstreamClient(conn)
			logs, err := client.StreamLogs(context.Background(), &gen.Empty{})
			if err != nil {
				panic(err)
			}

			for {
				msg, err := logs.Recv()

				if err != nil {
					panic(err)
				}

				ch <- msg.Log
			}
		},
	)

	for s := range ch {
		log := &log{}
		err := json.Unmarshal([]byte(s), log)
		if err != nil {
			panic(err)
		}

		//fmt.Println("")
		//fmt.Println("")
		//fmt.Println(s)
		//fmt.Println("")
		//fmt.Println(log)
		//fmt.Println("")

		// TODO!!
		if log.SystemdUnit == "syncthing.service" {
			continue
		}

		fmt.Println(log.Hostname, log.Unit, log.SyslogIdentifier, log.SystemdUnit)
		fmt.Println(log.Message)
		fmt.Println("")
	}
}

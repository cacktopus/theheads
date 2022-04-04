package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/grandcat/zeroconf"
	"github.com/spf13/cobra"
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

type serviceLog struct {
	//{"head":"head-01","level":"debug","msg":"saying","part":"rms/ef/9c6aed6e1b6ebc0bdcf686c18e0c8b.wav","time":"2021-01-31T16:51:01-08:00"}
	Msg   string  `json:"msg"`
	Level string  `json:"level"`
	Ts    float64 `json:"ts"`
	Time  string  `json:"time"`
}

func logs(cmd *cobra.Command, args []string) error {
	logger, _ := zap.NewProduction()

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

		// TODO!!
		if log.SystemdUnit == "syncthing.service" {
			continue
		}

		sl := &serviceLog{}
		err = json.Unmarshal([]byte(log.Message), sl)

		haveHeadsMessage := err == nil
		if haveHeadsMessage {
			//fmt.Println(log.Hostname, "  ", log.SyslogIdentifier, "  ", sl.Msg)
			fmt.Println(log.Hostname, "  ", log.SyslogIdentifier, "  ", log.Message)
		} else {
			fmt.Println(log.Hostname, log.SyslogIdentifier, log.Message)
		}
	}

	return nil
}

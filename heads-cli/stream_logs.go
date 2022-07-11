package heads_cli

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

type streamLogsCommand struct {
}

func (s *streamLogsCommand) Execute(args []string) error {
	//TODO: remove panics in this file

	type schema struct {
		Hostname         string `json:"_HOSTNAME"`
		Unit             string `json:"UNIT"`
		SyslogIdentifier string `json:"SYSLOG_IDENTIFIER"`
		SystemdUnit      string `json:"_SYSTEMD_UNIT"`
		Message          string `json:"MESSAGE"`
	}

	logger, _ := zap.NewProduction()
	ch := make(chan string)

	services, err := discovery.NewSerf("127.0.0.1:7373").Discover(logger)
	if err != nil {
		return errors.Wrap(err, "discover")
	}

	for _, entry := range services {
		if entry.Service != "logstream" {
			continue
		}

		go func(entry *discovery.Entry) {
			addr := fmt.Sprintf("%s:%d", entry.Hostname, entry.Port)

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
		}(entry)
	}

	for s := range ch {
		log := &schema{}
		err := json.Unmarshal([]byte(s), log)
		if err != nil {
			fmt.Println("unmarshal json error")
			fmt.Println("")
			continue
		}

		fmt.Println(log.Hostname, log.Unit, log.SyslogIdentifier, log.SystemdUnit)
		fmt.Println(log.Message)
		fmt.Println("")
	}

	return nil
}

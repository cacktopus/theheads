package logs

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"sort"
	"strings"
)

type journalSchema struct {
	Hostname         string `json:"_HOSTNAME"`
	Unit             string `json:"UNIT"`
	SyslogIdentifier string `json:"SYSLOG_IDENTIFIER"`
	SystemdUnit      string `json:"_SYSTEMD_UNIT"`
	Message          string `json:"MESSAGE"`
}

type StreamLogsCommand struct {
}

func (s *StreamLogsCommand) Execute(args []string) error {
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
				showLog(&journalSchema{
					Hostname: entry.Hostname,
					Message:  errors.Wrap(err, "ERROR DIALING HOST").Error(),
				}, nil)
				return
			}

			client := gen.NewLogstreamClient(conn)
			logs, err := client.StreamLogs(context.Background(), &gen.Empty{})
			if err != nil {
				showLog(&journalSchema{
					Hostname: entry.Hostname,
					Message:  errors.Wrap(err, "ERROR STREAMING LOGS").Error(),
				}, nil)
				return
			}

			for {
				msg, err := logs.Recv()
				if err != nil {
					showLog(&journalSchema{
						Hostname: entry.Hostname,
						Message:  errors.Wrap(err, "RECV ERROR").Error(),
					}, nil)
					return
				}

				ch <- msg.Log
			}
		}(entry)
	}

	for s := range ch {
		log := &journalSchema{}
		err := json.Unmarshal([]byte(s), log)
		if err != nil {
			fmt.Println("unmarshal json error")
			fmt.Println("")
			continue
		}

		zapLog := map[string]interface{}{}
		_ = json.Unmarshal([]byte(log.Message), &zapLog)

		if filter(log, zapLog) {
			continue
		}

		showLog(log, zapLog)
	}

	return nil
}

func filter(msg *journalSchema, zapLog map[string]interface{}) bool {
	if msg.SystemdUnit == "serf.service" && strings.Contains(msg.Message, "agent.ipc: Accepted client:") {
		return true
	}

	if msg.SystemdUnit == "rng-tools.service" {
		return true
	}

	message, _ := zapLog["msg"].(string)
	if message == "gin logged" {
		return true
	}

	return false
}

func showLog(
	log *journalSchema,
	zapLog map[string]interface{},
) {
	msg, _ := zapLog["msg"].(string)

	if msg == "" {
		fmt.Printf(
			"%s %s %s %s\n%s\n\n",
			log.Hostname,
			log.Unit,
			log.SyslogIdentifier,
			log.SystemdUnit,
			"  "+strings.TrimSpace(log.Message),
		)
	} else {
		var show []string

		for k, v := range zapLog {
			if k == "msg" {
				continue
			}
			show = append(show, fmt.Sprintf("    %s: %v", k, v))
		}

		sort.Strings(show)

		show = append([]string{"  " + msg}, show...)

		fmt.Printf(
			"%s %s %s %s\n%s\n\n",
			log.Hostname,
			log.Unit,
			log.SyslogIdentifier,
			log.SystemdUnit,
			strings.Join(show, "\n"),
		)
	}
}

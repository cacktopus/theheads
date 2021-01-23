package main

import (
	"bufio"
	"encoding/json"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"os/exec"
)

type handler struct {
	broker *broker.Broker
}

var (
	logCounts = promauto.NewCounterVec(prometheus.CounterOpts{
		Namespace: "heads",
		Subsystem: "logstream",
		Name:      "logged",
	}, []string{"level"})
)

func (h *handler) StreamLogs(empty *gen.Empty, server gen.Logstream_StreamLogsServer) error {
	ch := h.broker.Subscribe()
	defer h.broker.Unsubscribe(ch)

	for msg := range ch {
		log := msg.(*Log)
		err := server.Send(&gen.Log{Log: log.Log})
		if err != nil {
			return err
		}
	}

	return nil
}

type Log struct {
	Log string
}

func (l *Log) Name() string {
	panic("log")
}

var levels = map[string]string{
	"0": "emerg",
	"1": "alert",
	"2": "crit",
	"3": "err",
	"4": "warning",
	"5": "notice",
	"6": "info",
	"7": "debug",
}

type logSchema struct {
	Priority string `json:"PRIORITY"`
}

func main() {
	cmd := exec.Command("journalctl", "-f", "-o", "json", "-n", "0")
	pipe, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}

	b := broker.NewBroker()
	go b.Start()

	go func() {
		scanner := bufio.NewScanner(pipe)
		for scanner.Scan() {
			line := scanner.Bytes()
			log := &logSchema{}
			err := json.Unmarshal(line, log)
			if err != nil {
				logCounts.With(prometheus.Labels{"level": "badjson"}).Inc()
				continue
			}

			level, ok := levels[log.Priority]
			if !ok {
				level = "unknown"
			}

			logCounts.With(prometheus.Labels{"level": level}).Inc()
			b.Publish(&Log{Log: string(line)})
		}
	}()

	logger, _ := zap.NewProduction()

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   8088,
		GrpcSetup: func(s *grpc.Server) error {
			gen.RegisterLogstreamServer(s, &handler{broker: b})
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	go func() {
		err := server.Run()
		if err != nil {
			panic(err)
		}
	}()

	err = cmd.Run()
	if err != nil {
		panic(err)
	}
}

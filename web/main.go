package web

import (
	"embed"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/cacktopus/theheads/web/serf/client"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"strconv"
)

//go:embed templates/*
var f embed.FS

func Run() error {
	logger, err := zap.NewProduction()
	if err != nil {
		return errors.Wrap(err, "new logger")
	}

	strPort, ok := os.LookupEnv("HTTP_PORT")
	if !ok {
		strPort = "80"
	}

	port, err := strconv.Atoi(strPort)
	if err != nil {
		return errors.Wrap(err, "parse port")
	}

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger:    logger,
		Port:      port,
		GrpcSetup: nil,
		HttpSetup: setupRoutes(logger),
	})

	errCh := make(chan error)

	go func() {
		errCh <- server.Run()
	}()

	go monitorTemperatures(errCh)
	go turnOffLeds(logger, errCh)
	go turnOffHDMI(logger, errCh)
	go monitorLowVoltage(logger, errCh)
	go client.Run(errCh)

	for err := range errCh {
		if err != nil {
			return err
		}
	}

	return nil
}

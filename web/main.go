package web

import (
	"embed"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/standard_server"
	serfClient "github.com/cacktopus/theheads/web/serf/client"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"strconv"
)

//go:embed templates/*
var f embed.FS

func Run(discover discovery.Discovery) error {
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
		HttpSetup: setupRoutes(logger, discover),
	})

	errCh := make(chan error)

	go func() {
		errCh <- server.Run()
	}()

	go monitorTemperatures(errCh)
	go turnOffLeds(logger, errCh)
	go turnOffHDMI(logger, errCh)
	go monitorLowVoltage(logger, errCh)
	go serfClient.Run(logger, errCh)

	for err := range errCh {
		if err != nil {
			return err
		}
	}

	return nil
}

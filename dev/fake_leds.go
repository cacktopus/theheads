package main

import (
	"context"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

type fakeleds struct {
	fakeledsHandler
}

type fakeledsHandler struct {
}

func (l fakeledsHandler) Run(ctx context.Context, in *gen.RunIn) (*gen.Empty, error) {
	switch in.Name {
	case "highred", "rainbow":
		return &gen.Empty{}, nil
	default:
		return nil, errors.New("unknown animation")
	}
}

func (l fakeledsHandler) Events(empty *gen.Empty, server gen.Leds_EventsServer) error {
	//TODO implement me
	panic("implement me")
}

func (l fakeledsHandler) SetScale(ctx context.Context, in *gen.SetScaleIn) (*gen.Empty, error) {
	//TODO implement me
	panic("implement me")
}

func (l fakeledsHandler) Ping(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	return &gen.Empty{}, nil
}

func (l *fakeleds) Run(port int) {
	logger, _ := zap.NewProduction()

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   port,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterPingServer(grpcServer, l)
			gen.RegisterLedsServer(grpcServer, l.fakeledsHandler)
			return nil
		},
	})

	if err != nil {
		panic(err)
	}

	go server.Run()
}

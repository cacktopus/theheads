package grpc

import (
	"context"
	"encoding/json"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/head/cfg"
	"github.com/cacktopus/theheads/head/log_limiter"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/zero_detector"
	"github.com/cacktopus/theheads/head/sensor"
	"github.com/cacktopus/theheads/head/voices"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"net"
	"time"
)

type Handler struct {
	controller *motor.Controller
	limiter    *log_limiter.Limiter
	logger     *zap.Logger

	seeker motor.Actor
	sensor sensor.Sensor

	motorCfg *motor.Cfg
}

func NewHandler(
	controller *motor.Controller,
	limiter *log_limiter.Limiter,
	logger *zap.Logger,
	seeker motor.Actor,
	sensor sensor.Sensor,
	motorCfg *motor.Cfg,
) *Handler {
	return &Handler{
		controller: controller,
		limiter:    limiter,
		logger:     logger,
		seeker:     seeker,
		sensor:     sensor,
		motorCfg:   motorCfg,
	}
}

func (h *Handler) Events(empty *gen.Empty, server gen.Head_EventsServer) error {
	messages := h.controller.Broker.Subscribe()
	defer h.controller.Broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			panic(err)
		}

		err = server.Send(&gen.Event{
			Type: m.Name(),
			Data: data,
		})

		if err != nil {
			break
		}
	}

	h.logger.Info("Events() Handler finished")
	return nil
}

func (h *Handler) FindZero(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	h.logger.Info("find_zero called")

	detector := zero_detector.NewDetector(
		h.logger,
		h.sensor,
		h.motorCfg.NumSteps,
		h.motorCfg.DirectionChangePauses,
	)
	h.controller.SetActor(detector)

	return &gen.Empty{}, nil
}

func (h *Handler) Status(ctx context.Context, empty *gen.Empty) (*gen.HeadState, error) {
	h.logger.Info("status called")

	return h.headState(), nil
}

func (h *Handler) headState() *gen.HeadState {
	state := h.controller.GetState()

	return &gen.HeadState{
		Position:   int32(state.Pos),
		Target:     int32(state.Target),
		Rotation:   state.Rotation(),
		Controller: state.ActorName,
		StepsAway:  int32(state.StepsAway()),
		Eta:        state.Rotation(),
	}
}

func (h *Handler) Rotation(ctx context.Context, in *gen.RotationIn) (*gen.HeadState, error) {
	h.limiter.Do(func() {
		h.logger.Debug("rotation", zap.Float64("theta", in.Theta))
	})

	h.controller.SetActor(h.seeker)
	h.controller.SetTargetRotation(in.Theta)

	return h.headState(), nil
}

func Serve(
	logger *zap.Logger,
	listener net.Listener,
	controller *motor.Controller,
	seeker motor.Actor,
	sensor sensor.Sensor,
	cfg *cfg.Cfg,
) {
	h := &Handler{
		logger:     logger,
		limiter:    log_limiter.NewLimiter(250 * time.Millisecond),
		controller: controller,
		sensor:     sensor,
		seeker:     seeker,
		motorCfg:   &cfg.Motor,
	}

	s := grpc.NewServer()

	gen.RegisterHeadServer(s, h)
	gen.RegisterVoicesServer(s, voices.NewServer(&cfg.Voices, logger))

	reflection.Register(s)

	err := s.Serve(listener)
	if err != nil {
		panic(err)
	}
}

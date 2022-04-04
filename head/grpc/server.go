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
	"github.com/cacktopus/theheads/head/sensor/magnetometer"
	zero_detector2 "github.com/cacktopus/theheads/head/sensor/magnetometer/zero_detector"
	"github.com/cacktopus/theheads/head/voices"
	"github.com/pkg/errors"
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

	motorCfg     *motor.Cfg
	magnetometer magnetometer.Sensor
}

func (h *Handler) MotorOff(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	err := h.controller.TurnOffMotor()
	if err != nil {
		return nil, errors.Wrap(err, "turn off motor")
	}
	return &gen.Empty{}, nil
}

func NewHandler(
	controller *motor.Controller,
	limiter *log_limiter.Limiter,
	logger *zap.Logger,
	seeker motor.Actor,
	sensor sensor.Sensor,
	magnetometer magnetometer.Sensor,
	motorCfg *motor.Cfg,
) *Handler {
	return &Handler{
		controller:   controller,
		limiter:      limiter,
		logger:       logger,
		seeker:       seeker,
		sensor:       sensor,
		motorCfg:     motorCfg,
		magnetometer: magnetometer,
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

	var detector motor.Actor
	if h.magnetometer.HasHardware() {
		detector = zero_detector2.NewZeroDetector(
			h.logger,
			h.magnetometer,
			h.motorCfg.NumSteps,
			h.motorCfg.DirectionChangePauses,
		)
	} else {
		detector = zero_detector.NewDetector(
			h.logger,
			h.sensor,
			h.motorCfg.NumSteps,
			h.motorCfg.DirectionChangePauses,
		)
	}

	h.controller.SetActor(detector)

	return &gen.Empty{}, nil
}

func (h *Handler) Status(ctx context.Context, empty *gen.Empty) (*gen.HeadState, error) {
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

func (h *Handler) ReadHallEffectSensor(ctx context.Context, empty *gen.Empty) (*gen.ReadHallEffectSensorOut, error) {
	active, err := h.sensor.Read()
	if err != nil {
		return nil, errors.Wrap(err, "read sensor")
	}

	return &gen.ReadHallEffectSensorOut{Active: active}, nil
}

func (h *Handler) ReadMagnetSensor(ctx context.Context, empty *gen.Empty) (*gen.ReadMagnetSensorOut, error) {
	read, err := h.magnetometer.Read()
	if err != nil {
		return nil, errors.Wrap(err, "read")
	}
	return &gen.ReadMagnetSensorOut{
		Bx:          read.Bx,
		By:          read.By,
		Bz:          read.Bz,
		B:           read.B,
		Temperature: read.Temperature,
	}, nil
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

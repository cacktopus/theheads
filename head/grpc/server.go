package grpc

import (
	"context"
	"encoding/json"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/cacktopus/theheads/head/log_limiter"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/jitter"
	"github.com/cacktopus/theheads/head/motor/seeker"
	"github.com/cacktopus/theheads/head/motor/zero_detector"
	"github.com/cacktopus/theheads/head/sensor"
	"github.com/cacktopus/theheads/head/sensor/magnetometer"
	zero_detector2 "github.com/cacktopus/theheads/head/sensor/magnetometer/zero_detector"
	cmap "github.com/orcaman/concurrent-map/v2"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/types/known/durationpb"
)

type Handler struct {
	controller *motor.Controller
	limiter    *log_limiter.Limiter
	logger     *zap.Logger

	actors map[string]motor.Actor
	sensor sensor.Sensor

	motorCfg     *motor.Cfg
	magnetometer magnetometer.Sensor
	svgs         cmap.ConcurrentMap[string, []byte]
}

func NewHandler(
	controller *motor.Controller,
	limiter *log_limiter.Limiter,
	logger *zap.Logger,
	sensor sensor.Sensor,
	magnetometer magnetometer.Sensor,
	motorCfg *motor.Cfg,
	svgs cmap.ConcurrentMap[string, []byte],
) *Handler {
	actors := map[string]motor.Actor{}

	seeker := seeker.New(motorCfg.NumSteps)
	actors[seeker.Name()] = seeker

	jitter := jitter.New(motorCfg.NumSteps)
	actors[jitter.Name()] = jitter

	return &Handler{
		controller:   controller,
		limiter:      limiter,
		logger:       logger,
		actors:       actors,
		sensor:       sensor,
		motorCfg:     motorCfg,
		magnetometer: magnetometer,
		svgs:         svgs,
	}
}

func (h *Handler) Ping(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	return &heads.Empty{}, nil
}

func (h *Handler) MotorOff(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	err := h.controller.TurnOffMotor()
	if err != nil {
		return nil, errors.Wrap(err, "turn off motor")
	}
	return &heads.Empty{}, nil
}

func (h *Handler) Stream(empty *heads.Empty, server heads.Events_StreamServer) error {
	messages := h.controller.Broker.Subscribe()
	defer h.controller.Broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			panic(err)
		}

		err = server.Send(&heads.Event{
			Type: m.Name(),
			Data: string(data),
		})

		if err != nil {
			break
		}
	}

	h.logger.Info("Events() Handler finished")
	return nil
}

func (h *Handler) FindZero(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	var detector motor.Actor
	if h.magnetometer.HasHardware() {
		detector = zero_detector2.NewZeroDetector(
			h.logger,
			h.magnetometer,
			h.motorCfg.NumSteps,
			h.motorCfg.DirectionChangePauses,
			func() int {
				state := h.controller.GetState()
				return state.Pos
			},
			func(name string, content []byte) {
				h.svgs.Set(name, content)
			},
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

	return &heads.Empty{}, nil
}

func (h *Handler) Status(ctx context.Context, empty *heads.Empty) (*heads.HeadState, error) {
	return h.headState(), nil
}

func (h *Handler) headState() *heads.HeadState {
	state := h.controller.GetState()

	return &heads.HeadState{
		Position:   int32(state.Pos),
		Target:     int32(state.Target),
		Rotation:   state.Rotation(),
		Controller: state.ActorName,
		StepsAway:  int32(state.StepsAway()),
		Eta:        durationpb.New(state.Eta()),
	}
}

func (h *Handler) SetTarget(ctx context.Context, in *heads.SetTargetIn) (*heads.HeadState, error) {
	h.limiter.Do(func() {
		h.logger.Debug("rotation", zap.Float64("theta", in.Theta))
	})

	h.controller.SetTargetRotation(in.Theta)

	return h.headState(), nil
}

func (h *Handler) SetActor(ctx context.Context, in *heads.SetActorIn) (*heads.HeadState, error) {
	actor := h.actors[in.Actor]
	if actor == nil {
		return nil, errors.New("invalid actor")
	}

	h.controller.SetActor(actor)
	return h.headState(), nil
}

func (h *Handler) ReadHallEffectSensor(ctx context.Context, empty *heads.Empty) (*heads.ReadHallEffectSensorOut, error) {
	active, err := h.sensor.Read()
	if err != nil {
		return nil, errors.Wrap(err, "read sensor")
	}

	return &heads.ReadHallEffectSensorOut{Active: active}, nil
}

func (h *Handler) ReadMagnetSensor(ctx context.Context, empty *heads.Empty) (*heads.ReadMagnetSensorOut, error) {
	read, err := h.magnetometer.Read()
	if err != nil {
		return nil, errors.Wrap(err, "read")
	}
	return &heads.ReadMagnetSensorOut{
		Bx:          read.Bx,
		By:          read.By,
		Bz:          read.Bz,
		B:           read.B,
		Temperature: read.Temperature,
	}, nil
}

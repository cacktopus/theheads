package leds

import (
	"context"
	"encoding/json"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/pkg/errors"
)

type Handler struct {
	app *App
}

func (h *Handler) Ping(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	return &gen.Empty{}, nil
}

func (h *Handler) SetScale(ctx context.Context, in *gen.SetScaleIn) (*gen.Empty, error) {
	h.app.strip.SetScale(in.Scale)
	return &gen.Empty{}, nil
}

func (h *Handler) Events(empty *gen.Empty, server gen.Leds_EventsServer) error {
	messages := h.app.broker.Subscribe()
	defer h.app.broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			return errors.Wrap(err, "marshal json")
		}

		err = server.Send(&gen.Event{
			Type: m.Name(),
			Data: string(data),
		})

		if err != nil {
			break
		}
	}

	return nil
}

func (h *Handler) Run(ctx context.Context, in *gen.RunIn) (*gen.Empty, error) {
	_, ok := h.app.animations[in.Name]
	if !ok {
		return nil, errors.New("unknown animation")
	}

	h.app.ch <- &animateRequest{
		name:         in.Name,
		newStartTime: in.NewStartTime.AsTime(),
	}
	return &gen.Empty{}, nil
}

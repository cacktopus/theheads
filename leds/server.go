package leds

import (
	"context"
	"encoding/json"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/pkg/errors"
)

type Handler struct {
	app *App
}

func (h *Handler) Ping(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	return &heads.Empty{}, nil
}

func (h *Handler) SetScale(ctx context.Context, in *heads.SetScaleIn) (*heads.Empty, error) {
	h.app.strip.SetScale(in.Scale)
	return &heads.Empty{}, nil
}

func (h *Handler) Events(empty *heads.Empty, server heads.Leds_EventsServer) error {
	messages := h.app.broker.Subscribe()
	defer h.app.broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			return errors.Wrap(err, "marshal json")
		}

		err = server.Send(&heads.Event{
			Type: m.Name(),
			Data: string(data),
		})

		if err != nil {
			break
		}
	}

	return nil
}

func (h *Handler) Run(ctx context.Context, in *heads.RunIn) (*heads.Empty, error) {
	_, ok := h.app.animations[in.Name]
	if !ok {
		return nil, errors.New("unknown animation")
	}

	h.app.ch <- &animateRequest{
		name:         in.Name,
		newStartTime: in.NewStartTime.AsTime(),
	}
	return &heads.Empty{}, nil
}

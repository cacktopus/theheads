package head_manager

import (
	"context"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/protobuf/types/known/durationpb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"time"
)

func (h *HeadManager) GetConn(URI string) (*Connection, error) {
	h.lock.Lock()
	defer h.lock.Unlock()

	conn, ok := h.clients[URI]
	if !ok {
		return nil, ErrNoServiceFound
	}

	return conn, nil
}

func (h *HeadManager) SetTarget(
	ctx context.Context,
	headURI string,
	theta float64,
) (*gen.HeadState, error) {
	client, err := h.GetConn(headURI)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return gen.NewHeadClient(client.Conn).SetTarget(ctx, &gen.SetTargetIn{
		Theta: theta,
	})
}

func (h *HeadManager) SetActor(
	ctx context.Context,
	headURI string,
	actor string,
) (*gen.HeadState, error) {
	client, err := h.GetConn(headURI)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return gen.NewHeadClient(client.Conn).SetActor(ctx, &gen.SetActorIn{
		Actor: actor,
	})
}

func (h *HeadManager) Say(
	ctx context.Context,
	logger *zap.Logger,
	headURI string,
	sound string,
) {
	conn, err := h.GetConn(headURI)
	if err != nil {
		logger.Error("error fetching head connection", zap.Error(err))
		// TODO: might need dj.Sleep()
		time.Sleep(5 * time.Second) // Sleep for length of some typical text
	} else {
		client := gen.NewVoicesClient(conn.Conn)
		_, err = client.Play(ctx, &gen.PlayIn{Sound: sound})
		if err != nil {
			logger.Error("error playing sound", zap.Error(err), zap.String("sound", sound))
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) SayRandom(ctx context.Context, headURI string) error {
	conn, err := h.GetConn(headURI)
	if err != nil {
		return errors.Wrap(err, "get conn")
	}
	client := gen.NewVoicesClient(conn.Conn)
	_, err = client.Random(ctx, &gen.Empty{})
	return err
}

func (h *HeadManager) SetLedsAnimation(
	ctx context.Context,
	logger *zap.Logger,
	uri string,
	animationName string,
	startTime time.Time,
) {
	conn, err := h.GetConn(uri)
	if err != nil {
		logger.Error("error fetching head connection", zap.Error(err))
		return
	}

	_, err = gen.NewLedsClient(conn.Conn).Run(
		ctx,
		&gen.RunIn{
			Name:         animationName,
			NewStartTime: timestamppb.New(startTime),
		},
	)
	if err != nil {
		logger.Error("error setting led animation", zap.Error(err))
	}
}

func (h *HeadManager) EnableFaceDetection(
	ctx context.Context,
	uri string,
	duration time.Duration,
) error {
	conn, err := h.GetConn(uri)
	if err != nil {
		return errors.Wrap(err, "get connection")
	}

	_, err = gen.NewCameraClient(conn.Conn).DetectFaces(ctx, &gen.DetectFacesIn{
		EnableFor: durationpb.New(duration),
	})

	return errors.Wrap(err, "enable detect faces")
}

package head_manager

import (
	"context"
	"github.com/cacktopus/theheads/gen/go/heads"
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
) (*heads.HeadState, error) {
	client, err := h.GetConn(headURI)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return heads.NewHeadClient(client.Conn).SetTarget(ctx, &heads.SetTargetIn{
		Theta: theta,
	})
}

func (h *HeadManager) SetActor(
	ctx context.Context,
	headURI string,
	actor string,
) (*heads.HeadState, error) {
	client, err := h.GetConn(headURI)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return heads.NewHeadClient(client.Conn).SetActor(ctx, &heads.SetActorIn{
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
		client := heads.NewVoicesClient(conn.Conn)
		_, err = client.Play(ctx, &heads.PlayIn{Sound: sound})
		if err != nil {
			logger.Error("error playing sound", zap.Error(err), zap.String("sound", sound))
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) SetVolume(
	ctx context.Context,
	logger *zap.Logger,
	headURI string,
) {
	conn, err := h.GetConn(headURI)
	if err != nil {
		logger.Error("error fetching head connection", zap.Error(err))
	} else {
		client := heads.NewVoicesClient(conn.Conn)
		_, err = client.SetVolume(ctx, &heads.SetVolumeIn{VolDb: -1})
		if err != nil {
			logger.Error("error setting volume", zap.Error(err))
		}
	}
}

func (h *HeadManager) SayRandom(ctx context.Context, headURI string) error {
	conn, err := h.GetConn(headURI)
	if err != nil {
		return errors.Wrap(err, "get conn")
	}
	client := heads.NewVoicesClient(conn.Conn)
	_, err = client.Random(ctx, &heads.Empty{})
	return err
}

func (h *HeadManager) SetLedsAnimation(
	ctx context.Context,
	parentLogger *zap.Logger,
	uri string,
	animationName string,
	startTime time.Time,
) {
	logger := parentLogger.With(zap.String("uri", uri))

	conn, err := h.GetConn(uri)
	if err != nil {
		logger.Error("error fetching head connection", zap.Error(err))
		return
	}

	_, err = heads.NewLedsClient(conn.Conn).Run(
		ctx,
		&heads.RunIn{
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

	_, err = heads.NewCameraClient(conn.Conn).DetectFaces(ctx, &heads.DetectFacesIn{
		EnableFor: durationpb.New(duration),
	})

	return errors.Wrap(err, "enable detect faces")
}

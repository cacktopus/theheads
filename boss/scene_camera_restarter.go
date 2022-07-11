package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"time"
)

func CameraRestarter(
	ctx context.Context,
	dj *DJ,
	done util.BroadcastCloser,
	logger *zap.Logger,
) {
	rate_limiter.LimitTrailing("camera.restart", 10*time.Minute, func() {
		if len(dj.grid.GetFocalPoints().FocalPoints) == 0 {
			return
		}
		for _, c := range dj.scene.Cameras {
			go func(camera *scene.Camera) {
				logger.Info("restarting camera", zap.String("camera", camera.Name))

				// TODO: need a way to find the camera instance
				logger.Error(
					"error restarting camera",
					zap.String("camera", camera.Name),
					zap.Error(errors.New("not implemented")),
				)
			}(c)
		}
	})

	dj.Sleep(done, 50*time.Millisecond)
	done.Close()
}

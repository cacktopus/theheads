package basic

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"time"
)

func CameraRestarter(sp *dj.SceneParams) {
	rate_limiter.LimitTrailing("camera.restart", 10*time.Minute, func() {
		if len(sp.DJ.Grid.GetFocalPoints().FocalPoints) == 0 {
			return
		}
		for _, c := range sp.DJ.Scene.Cameras {
			go func(camera *scene.Camera) {
				sp.Logger.Info("restarting camera", zap.String("camera", camera.Name))

				// TODO: need a way to find the camera instance
				sp.Logger.Error(
					"error restarting camera",
					zap.String("camera", camera.Name),
					zap.Error(errors.New("not implemented")),
				)
			}(c)
		}
	})

	sp.DJ.Sleep(sp.Done, 50*time.Millisecond)
	sp.Done.Close()
}

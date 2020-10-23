package main

import (
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/sirupsen/logrus"
	"time"
)

func CameraRestarter(dj *DJ, done util.BroadcastCloser, entry *logrus.Entry) {
	rate_limiter.Limit("camera.restart", 10*time.Minute, func() {
		if len(dj.grid.GetFocalPoints()) == 0 {
			return
		}
		for _, c := range dj.scene.Cameras {
			go func(camera *scene.Camera) {
				logrus.WithField("camera", camera.Name).Info("Restarting camera")
				result := dj.headManager.SendWithResult("camera", camera.Name, "/restart", nil)
				if result.Err != nil {
					logrus.WithError(result.Err).Error("error restarting camera")
				}
			}(c)
		}
	})

	dj.Sleep(done, 50*time.Millisecond)
	done.Close()
}

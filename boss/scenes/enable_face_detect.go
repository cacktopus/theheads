package scenes

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/scene"
	"go.uber.org/zap"
	"time"
)

func EnableFaceDetection(
	sp *dj.SceneParams,
	head *scene.Head,
) {
	ticker := time.NewTicker(250 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			enableFaceDetectionForHead(sp, head)
		case <-sp.Done.Chan():
			return
		}
	}
}

func enableFaceDetectionForHead(sp *dj.SceneParams, head *scene.Head) {
	p := head.GlobalPos()

	selected, distance := sp.DJ.Grid.ClosestFocalPointTo(p)
	if selected == nil {
		return
	}

	if distance < 0.10 && distance > 2 {
		return
	}

	err := sp.DJ.HeadManager.EnableFaceDetection(sp.Ctx, head.CameraURI(), 20*time.Second)
	if err != nil {
		sp.Logger.Error("error enabling face detection", zap.Error(err))
	}
}

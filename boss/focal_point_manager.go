package main

import (
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/prometheus/common/log"
)

type MotionLine struct {
	P0 [2]float64 `json:"p0"`
	P1 [2]float64 `json:"p1"`
}

func (MotionLine) Name() string {
	return "motion-line"
}

func ManageFocalPoints(theScene scene.Scene, broker *Broker, grid *Grid) {
	msgs := broker.Subscribe()

	for i := range msgs {
		switch msg := i.(type) {
		case MotionDetected:
			cam, ok := theScene.Cameras[msg.CameraName]
			if !ok {
				log.Error("Unknown camera: ", msg.CameraName)
			} else {
				log.Info("Found camera: ", cam.Name, cam.Stand.Pos)

				rotz := geom.Rotz(msg.Position)

				p0 := geom.ZeroVec()
				p1 := rotz.MulVec(geom.NewVec(10, 0))

				m := cam.Stand.M.Mul(cam.M)

				p0 = m.MulVec(p0)
				p1 = m.MulVec(p1)

				ml := MotionLine{
					P0: [2]float64{p0.X(), p0.Y()},
					P1: [2]float64{p1.X(), p1.Y()},
				}
				log.Info(ml)
				broker.Publish(ml)

				grid.Trace(msg.CameraName, p0, p1)
			}
		}
	}
}

package main

import (
	"github.com/cacktopus/theheads/boss/broker"
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/sirupsen/logrus"
)

func ManageFocalPoints(theScene *scene.Scene, msgBroker *broker.Broker, grid *grid.Grid) {
	msgs := msgBroker.Subscribe()

	for i := range msgs {
		switch msg := i.(type) {
		case broker.MotionDetected:
			cam, ok := theScene.Cameras[msg.CameraName]
			if !ok {
				logrus.Error("Unknown camera: ", msg.CameraName)
			} else {
				rotz := geom.Rotz(msg.Position)

				p0 := geom.ZeroVec()
				p1 := rotz.MulVec(geom.NewVec(10, 0))

				m := cam.Stand.M.Mul(cam.M)

				p0 = m.MulVec(p0)
				p1 = m.MulVec(p1)

				ml := schema.MotionLine{
					P0: [2]float64{p0.X(), p0.Y()},
					P1: [2]float64{p1.X(), p1.Y()},
				}
				msgBroker.Publish(ml)

				grid.Trace(msg.CameraName, p0, p1)
			}
		}
	}
}

package main

import (
	"github.com/cacktopus/heads/boss/geom"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/prometheus/common/log"
	"gonum.org/v1/gonum/mat"
)

type MotionLine struct {
	P0 [2]float64 `json:"p0"`
	P1 [2]float64 `json:"p1"`
}

func (MotionLine) Name() string {
	return "motion-line"
}

func ManageFocalPoints(theScene scene.Scene, broker *Broker) {
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

				p0 := mat.NewVecDense(3, []float64{0, 0, 1})
				p1 := mat.NewVecDense(3, nil)
				p1.MulVec(rotz, mat.NewVecDense(3, []float64{10, 0, 1}))

				q0 := mat.NewVecDense(3, nil)
				q1 := mat.NewVecDense(3, nil)

				m := geom.MatMul(cam.Stand.M, cam.M)
				q0.MulVec(m, p0)
				q1.MulVec(m, p1)

				ml := MotionLine{
					P0: [2]float64{q0.AtVec(0), q0.AtVec(1)},
					P1: [2]float64{q1.AtVec(0), q1.AtVec(1)},
				}
				log.Info(ml)
				broker.Publish(ml)
			}
		}
	}
}

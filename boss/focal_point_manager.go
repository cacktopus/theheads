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

func ManageFocalPoints(theScene scene.Scene, broker *Broker) {
	msgs := broker.Subscribe()

	for i := range msgs {
		switch msg := i.(type) {
		case MotionDetected:
			cam, ok := theScene.Cameras[msg.CameraName]
			if !ok {
				log.Error("Unknown camera: ", msg.CameraName)
			} else {
				log.Info("Found camera: ", cam.Name)

				rotz := geom.Rotz(msg.Position)

				p0 := mat.NewVecDense(3, []float64{0, 0, 0})
				p1 := mat.NewVecDense(3, nil)
				p1.MulVec(rotz, mat.NewVecDense(3, []float64{10, 0, 0}))

				q0 := mat.NewVecDense(3, []float64{10, 0, 0})
				q1 := mat.NewVecDense(3, []float64{10, 0, 0})

				mul := geom.MatMul(cam.Stand.M, cam.M)
				q0.MulVec(mul, p0)
				q1.MulVec(mul, p1)

				ml := MotionLine{
					P0: [2]float64{q0.AtVec(0), q0.AtVec(1)},
					P1: [2]float64{q1.AtVec(0), q1.AtVec(1)},
				}
				log.Info(ml)
				// broker.publishCh ...
			}
		}
	}
}

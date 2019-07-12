package main

import (
	"github.com/prometheus/common/log"
	"gonum.org/v1/gonum/mat"
	"math"
)

func Rotz(thetaDegrees float64) *mat.Dense {
	t := thetaDegrees * math.Pi / 180
	return mat.NewDense(3, 3, []float64{
		math.Cos(t), -math.Sin(t), 0,
		math.Sin(t), math.Cos(t), 0,
		0, 0, 1,
	})
}

type MotionLine struct {
	P0 [2]float64 `json:"p0"`
	P1 [2]float64 `json:"p1"`
}

func ManageFocalPoints(scene Scene, broker *Broker) {
	msgs := broker.Subscribe()

	for i := range msgs {
		switch msg := i.(type) {
		case MotionDetected:
			cam, ok := scene.Cameras[msg.CameraName]
			if !ok {
				log.Error("Unknown camera: ", msg.CameraName)
			} else {
				log.Info("Found camera: ", cam.Name)

				p0 := mat.NewVecDense(3, []float64{0, 0, 0})
				p1 := mat.NewVecDense(3, []float64{0, 0, 0})

				rotz := Rotz(msg.Position)

				p1.MulVec(rotz, mat.NewVecDense(3, []float64{10, 0, 0}))

				ml := MotionLine{
					P0: [2]float64{p0.AtVec(0), p0.AtVec(1)},
					P1: [2]float64{p1.AtVec(0), p1.AtVec(1)},
				}

				log.Info(ml)
				// TODO: need
				//   p0 = cam.stand.m * cam.m * p0
				//   p1 = cam.stand.m * cam.m * p1

				// broker.publishCh ...
			}
		}
	}
}

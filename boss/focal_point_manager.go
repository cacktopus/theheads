package main

import (
	"github.com/prometheus/common/log"
)

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
			}
		}
	}
}

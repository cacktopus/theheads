package main

import "fmt"

func ManageFocalPoints(broker *Broker) {
	msgs := broker.Subscribe()

	for m := range msgs {
		switch msg := m.(type) {
		case MotionDetected:
			fmt.Println("Detected motion for camrea:", msg.CameraName)
		}

	}
}

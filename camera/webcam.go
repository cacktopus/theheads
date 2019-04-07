package main

import (
	"fmt"
	"gocv.io/x/gocv"
)

func setupWebcam() *gocv.VideoCapture {
	webcam, _ := gocv.OpenVideoCapture(0)
	//window := gocv.NewWindow("Hello")
	webcam.Set(gocv.VideoCaptureFrameWidth, width)
	webcam.Set(gocv.VideoCaptureFrameHeight, height)
	initialRate := webcam.Get(gocv.VideoCaptureFPS)
	fmt.Println("initial rate", initialRate)
	webcam.Set(gocv.VideoCaptureFPS, rate)
	return webcam
}

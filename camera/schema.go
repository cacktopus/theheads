package main

type MessageHeader struct {
	Type         string `json:"type"`
	Installation string `json:"installation"`
}

type MotionDetectedData struct {
	CameraName string  `json:"cameraName"`
	Position   float64 `json:"position"`
}

type MotionDetected struct {
	MessageHeader
	MotionDetectedData `json:"data"`
}

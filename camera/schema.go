package main

type MessageHeader struct {
	Type string `json:"type"`
}

type MotionDetectedData struct {
	CameraName string  `json:"cameraName"`
	Position   float64 `json:"position"`
}

type MotionDetected struct {
	MessageHeader
	MotionDetectedData `json:"data"`
}

type PingData struct {
	Name string `json:"name"`
}

type Ping struct {
	MessageHeader
	PingData `json:"data"`
}

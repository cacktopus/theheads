package schema

// TODO: consolidate all messages (c.f. boss::broker)

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

type HeadPositionedData struct {
	HeadName     string  `json:"headName"`
	StepPosition int     `json:"stepPosition"`
	Rotation     float64 `json:"rotation"`
}

type HeadPositioned struct {
	MessageHeader
	Data HeadPositionedData `json:"data"`
}

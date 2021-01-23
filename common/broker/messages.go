package broker

// TODO: consolidate all messages (c.f. common::schema)

type MotionDetected struct {
	CameraName string  `json:"cameraName"`
	Position   float64 `json:"position"`
}

func (MotionDetected) Name() string {
	return "motion-detected"
}

type HeadPositioned struct {
	HeadName     string  `json:"headName"`
	StepPosition float32 `json:"stepPosition"`
	Rotation     float32 `json:"rotation"`
}

func (HeadPositioned) Name() string {
	return "head-positioned"
}

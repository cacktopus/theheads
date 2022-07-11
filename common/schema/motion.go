package schema

type MotionDetected struct {
	CameraName string
	Position   float64
}

func (*MotionDetected) Name() string {
	return "motion-detected"
}

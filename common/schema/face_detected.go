package schema

type FaceDetected struct {
	CameraName string
	Position   float64
	Area       float64
}

func (*FaceDetected) Name() string {
	return "face-detected"
}

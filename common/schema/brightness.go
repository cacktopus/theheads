package schema

type Brightness struct {
	Brightness         float64
	MeanBrightness1min float64
	CameraName         string
}

func (b *Brightness) Name() string {
	return "brightness"
}

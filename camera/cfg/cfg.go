package cfg

type Floodlight struct {
	Pin int // 17 for heads
}

type Cfg struct {
	BitrateKB         int
	CenterLine        bool
	DetectFaces       bool
	DrawFrame         string
	DrawMotion        bool
	FloodlightPin     int // 17 for heads
	FOV               float64
	Framerate         int
	Height            int
	Hflip             bool
	Instance          string
	MotionDetectWidth int
	MotionMinArea     float64
	MotionThreshold   int
	Port              int
	PrescaleWidth     int
	RaspiStill        bool
	RaspividExtraArgs []string `envconfig:"optional"`
	Source            string
	Vflip             bool
	WarmupFrames      int
	Width             int
	WriteFacesPath    string `envconfig:"optional"`
}

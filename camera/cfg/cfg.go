package cfg

import "time"

type Floodlight struct {
	Pin int // 17 for heads
}

type Cfg struct {
	BitrateKB          int
	CenterLine         bool
	DetectFaces        bool
	DrawFrame          string
	DrawMotion         bool
	FOV                float64
	FloodlightPin      int // 17 for heads
	Framerate          int
	Height             int
	Hflip              bool
	Instance           string
	MotionDetectWidth  int
	MotionMinArea      float64
	MotionShutoffDelay time.Duration
	MotionThreshold    int
	Outdir             string
	Port               int
	PrescaleWidth      int
	RaspiStill         bool
	RaspividExtraArgs  []string `envconfig:"optional"`
	RecorderBufsize    int
	RecorderMaxSize    int64
	Source             string
	Vflip              bool
	WarmupFrames       int
	Width              int
	WriteFacesPath     string `envconfig:"optional"`
}

package cfg

import "time"

type Floodlight struct {
	Pin int `envconfig:"default=17"`

	MinBrightness float64 `envconfig:"default=20"`
	MaxBrightness float64 `envconfig:"default=60"`

	FrameBuffer int `envconfig:"default=60"`
}

type Cfg struct {
	Instance string

	Floodlight Floodlight

	Filename string `envconfig:"optional"`

	Port int `envconfig:"default=5000"`

	CenterLine bool `envconfig:"optional"`

	Hflip bool `envconfig:"default=true"`
	Vflip bool `envconfig:"default=true"`

	Width  int `envconfig:"default=320"`
	Height int `envconfig:"default=240"`

	DrawMotion bool `envconfig:"default=true"`

	RaspiStill bool `envconfig:"default=true"`

	Bitrate   int `envconfig:"default=400"` // kb
	Framerate int `envconfig:"default=25"`

	DrawFrame string `envconfig:"default=orig"`

	PrescaleWidth int `envconfig:"default=640"`

	MotionDetectWidth int     `envconfig:"default=320"`
	MotionThreshold   int     `envconfig:"default=16"`
	MotionMinArea     float64 `envconfig:"default=160"`

	Outdir string `envconfig:"default=."`

	ROI string `envconfig:"optional"`

	RecorderBufsize    int           `envconfig:"default=5"`
	MotionShutoffDelay time.Duration `envconfig:"default=5s"`
	RecorderMaxSize    int64         `envconfig:"default=16000000000"`

	RaspividExtraArgs []string `envconfig:"optional"`
}

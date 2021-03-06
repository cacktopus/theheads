package cfg

import "time"

type Cfg struct {
	Instance string

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
}

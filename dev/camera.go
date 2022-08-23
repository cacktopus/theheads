package main

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/common/util"
)

func cameraEnv(name string, streamFile string) *cfg.Cfg {
	return &cfg.Cfg{
		BitrateKB:         400,
		CenterLine:        false,
		DetectFaces:       true,
		DrawFrame:         "orig",
		DrawMotion:        true,
		FloodlightPin:     17,
		FOV:               64.33,
		Framerate:         25,
		Height:            240,
		Hflip:             false,
		Instance:          name,
		MotionDetectWidth: 320,
		MotionMinArea:     160,
		MotionThreshold:   16,
		Port:              util.RandomPort(),
		PrescaleWidth:     640,
		RaspiStill:        false,
		RaspividExtraArgs: nil,
		Source:            "file:" + streamFile,
		Vflip:             false,
		WarmupFrames:      0,
		Width:             320,
		WriteFacesPath:    "",
	}
}

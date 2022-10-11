package main

import (
	"github.com/cacktopus/theheads/common/dotenv"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/leds"
	"go.uber.org/zap"
)

func main() {
	logger, _ := util.NewLogger(false)

	dotenv.EnvOverrideFromFile(logger, "/boot/leds.env")

	err := leds.Run(logger)
	if err != nil {
		logger.Fatal("error", zap.Error(err))
	}
}

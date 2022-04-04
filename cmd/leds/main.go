package main

import (
	"github.com/cacktopus/theheads/leds"
	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()

	err := leds.Run(logger)
	if err != nil {
		logger.Fatal("error", zap.Error(err))
	}
}

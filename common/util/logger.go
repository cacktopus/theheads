package util

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func NewLogger(debug bool) (*zap.Logger, error) {
	config := zap.NewProductionConfig()
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("2006-01-02T15:04:05.000")
	if debug {
		config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	}
	return config.Build()
}

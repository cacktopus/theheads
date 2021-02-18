package main

import (
	"go.uber.org/zap"
	"os/exec"
)

func turnOffHDMI(logger *zap.Logger, errCh chan error) {
	cmd := exec.Command("tvservice", "-o")
	output, err := cmd.CombinedOutput()
	if err != nil {
		logger.Error(
			"error turning of HDMI",
			zap.Error(err),
			zap.String("output", string(output)),
		)
	}
}

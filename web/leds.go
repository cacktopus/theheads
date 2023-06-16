package web

import (
	"fmt"
	"go.uber.org/zap"
	"io/ioutil"
	"os/exec"
	"strings"
	"time"
)

func platform() (string, error) {
	cmd := exec.Command("uname", "-m")
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}

	return strings.TrimSpace(string(output)), nil
}

func writefile(logger *zap.Logger, filename, content string) {
	if err := ioutil.WriteFile(
		filename,
		[]byte(content+"\n"),
		0o660,
	); err != nil {
		logger.Error("error writing file", zap.String("filename", filename), zap.Error(err))
	}
}

func turnOffLeds(logger *zap.Logger, errCh chan error) {
	time.Sleep(30 * time.Second)

	// TODO: we're using "platform" here as a proxy. Raspberry pi zero has different led semantics

	platform, err := platform()
	if err != nil {
		logger.Error("error determining platform", zap.Error(err))
		return
	}

	switch platform {
	case "armv7l", "aarch64":
		for _, name := range []string{"led0", "led1"} {
			writefile(logger, fmt.Sprintf("/sys/class/leds/%s/trigger", name), "none")
			writefile(logger, fmt.Sprintf("/sys/class/leds/%s/brightness", name), "0")
		}
	case "armv6l":
		name := "led0"
		writefile(logger, fmt.Sprintf("/sys/class/leds/%s/trigger", name), "none")
		writefile(logger, fmt.Sprintf("/sys/class/leds/%s/brightness", name), "0")
	default:
		logger.Warn("unknown platform", zap.String("platform", platform))
	}
}

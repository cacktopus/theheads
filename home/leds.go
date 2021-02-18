package main

import (
	"fmt"
	"go.uber.org/zap"
	"io/ioutil"
	"time"
)

func turnOffLeds(logger *zap.Logger, errCh chan error) {
	time.Sleep(30 * time.Second)

	for _, name := range []string{"led0", "led1"} {
		filename := fmt.Sprintf("/sys/class/leds/%s/brightness", name)
		err := ioutil.WriteFile(filename, []byte("0\n"), 0o660)
		if err != nil {
			logger.Error("error turning off led", zap.String("name", name), zap.Error(err))
		}
	}
}

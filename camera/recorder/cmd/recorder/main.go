package main

import (
	"github.com/cacktopus/theheads/camera/recorder"
	"go.uber.org/zap"
	"os"
	"time"
)

func main() {
	logger, _ := zap.NewProduction()

	rec := recorder.NewRecorder(logger, 5, ".")

	go func() {
		err := rec.Run(os.Stdin)
		if err != nil {
			panic(err)
		}
	}()

	go func() {
		for {
			time.Sleep(10 * time.Second)
			rec.Record()
			time.Sleep(20 * time.Second)
			rec.Stop()
		}
	}()

	select {}
}

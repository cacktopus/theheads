package main

import (
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

func pollHead(dj *DJ, done util.BroadcastCloser, ws *sync.WaitGroup, h *scene.Head) {
	log := logrus.WithField("head", h.Name)

	dj.headManager.sendWithResult("head", h.Name, "/find_zero", nil)

	ticker := time.NewTicker(1 * time.Second)

	for {
		select {
		case <-ticker.C:
			headResult := HeadResult{}
			result := dj.headManager.sendWithResult("head", h.Name, "/status", &headResult)
			if result.Err != nil {
				log.WithError(result.Err).Error("Error polling head status")
				continue
			}

			if headResult.Controller != "" && headResult.Controller != "ZeroDetector" {
				ws.Done()
				return
			}
		case <-done.Chan():
			ws.Done()
			return
		}
	}
}

func FindZeros(
	dj *DJ,
	done util.BroadcastCloser,
) {
	ws := &sync.WaitGroup{}

	for _, h := range dj.scene.Heads {
		ws.Add(1)
		go pollHead(dj, done, ws, h)
	}

	go func() {
		ws.Wait()
		done.Close()
	}()

	<-done.Chan()
	logrus.Info("Exiting FindZeros")
	watchdog.Feed()
}

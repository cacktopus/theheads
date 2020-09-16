package main

import (
	"fmt"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/sirupsen/logrus"
	"math/rand"
	"time"
)

const (
	moveChance  = 0.0005
	speakChance = 0.0005
)

func Random(dj *DJ, done util.BroadcastCloser) {
	for {
		select {
		case <-time.After(trackingPeriod):
			for _, head := range dj.scene.HeadList {
				if rand.Float64() < moveChance {
					theta := rand.Float64() * 360.0
					path := fmt.Sprintf("/rotation/%f", theta)
					dj.headManager.send("head", head.Name, path)
					logrus.WithFields(logrus.Fields{
						"head":  head.Name,
						"theta": theta,
					}).Info("moving")
				}

				if rand.Float64() < speakChance {
					playPath := fmt.Sprintf("/random")
					dj.headManager.send("voices", head.Name, playPath)
					logrus.WithFields(logrus.Fields{
						"head": head.Name,
					}).Info("Saying")
				}
			}
		case <-done.Chan():
			return
		}
	}
}

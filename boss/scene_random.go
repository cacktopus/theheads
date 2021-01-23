package boss

import (
	"github.com/cacktopus/theheads/boss/util"
	"github.com/sirupsen/logrus"
	"math/rand"
	"time"
)

const (
	moveChance  = 0.0005
	speakChance = 0.0005
)

func Random(dj *DJ, done util.BroadcastCloser, logger *logrus.Entry) {
	for {
		select {
		case <-time.After(trackingPeriod):
			for _, head := range dj.scene.HeadList {
				if rand.Float64() < moveChance {
					theta := rand.Float64() * 360.0
					_, err := dj.headManager.Position("head", theta)
					if err != nil {
						logger.WithError(err).Error("error positioning")
					}
					logger.WithFields(logrus.Fields{
						"head":  head.Name,
						"theta": theta,
					}).Info("moving")
				}

				if rand.Float64() < speakChance {
					go func() {
						dj.headManager.SayRandom(head.Name)
					}()
					logger.WithFields(logrus.Fields{
						"head": head.Name,
					}).Info("Saying")
				}
			}
		case <-done.Chan():
			return
		}
	}
}

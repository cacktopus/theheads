package boss

import (
	"github.com/cacktopus/theheads/boss/util"
	"go.uber.org/zap"
	"math/rand"
	"time"
)

const (
	moveChance  = 0.0005
	speakChance = 0.0005
)

func Random(dj *DJ, done util.BroadcastCloser, logger *zap.Logger) {
	for {
		select {
		case <-time.After(trackingPeriod):
			for _, head := range dj.scene.HeadList {
				if rand.Float64() < moveChance {
					theta := rand.Float64() * 360.0
					_, err := dj.headManager.Position("head", theta)
					if err != nil {
						logger.Error("error positioning", zap.Error(err))
					}
					logger.Info("moving", zap.String("head", head.Name), zap.Float64("theta", theta))
				}

				if rand.Float64() < speakChance {
					go func() {
						dj.headManager.SayRandom(head.Name)
					}()
					logger.Info("saying", zap.String("head", head.Name))
				}
			}
		case <-done.Chan():
			return
		}
	}
}

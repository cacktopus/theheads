package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"go.uber.org/zap"
	"sync"
	"time"
)

func pollHead(dj *DJ, done util.BroadcastCloser, ws *sync.WaitGroup, h *scene.Head) {
	defer ws.Done()
	logger := dj.logger.With(zap.String("head", h.Name))

	conn, err := dj.headManager.GetHeadConn(h.Name)
	if err != nil {
		logger.Error("error getting head connection", zap.Error(err))
		return
	}
	client := gen.NewHeadClient(conn)

	_, err = client.FindZero(context.Background(), &gen.Empty{})
	if err != nil {
		logger.Error("error finding zero", zap.Error(err))
		return
	}

	ticker := time.NewTicker(1 * time.Second)

	for {
		select {
		case <-ticker.C:
			status, err := client.Status(context.Background(), &gen.Empty{})
			if err != nil {
				logger.Error("error polling head status", zap.Error(err))
				continue
			}

			logger.Debug("polled head status", zap.String("controller", status.Controller))

			if status.Controller != "" {
				switch status.Controller {
				case "ZeroDetector", "magnetometer zero detector":
					continue // zero detection not complete
				}
				return
			}
		case <-done.Chan():
			logger.Warn("FindZeros exited without finding all zeros")
			return
		}
	}
}

func FindZeros(
	dj *DJ,
	done util.BroadcastCloser,
	logger *zap.Logger,
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
	logger.Info("Exiting FindZeros")
	watchdog.Feed()
}

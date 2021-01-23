package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

func pollHead(dj *DJ, done util.BroadcastCloser, ws *sync.WaitGroup, h *scene.Head) {
	defer ws.Done()
	logger := logrus.WithField("head", h.Name)

	conn, err := dj.headManager.GetHeadConn(h.Name)
	if err != nil {
		logger.WithError(err).Error("error getting head client")
		return
	}
	client := gen.NewHeadClient(conn)

	_, err = client.FindZero(context.Background(), &gen.Empty{})
	if err != nil {
		logger.WithError(err).Error("error getting head client")
		return
	}

	ticker := time.NewTicker(1 * time.Second)

	for {
		select {
		case <-ticker.C:
			status, err := client.Status(context.Background(), &gen.Empty{})
			if err != nil {
				logger.WithError(err).Error("Error polling head status")
				continue
			}
			logger.WithField("controller", status.Controller).Info("polled status")

			if status.Controller != "" && status.Controller != "ZeroDetector" {
				return
			}
		case <-done.Chan():
			return
		}
	}
}

func FindZeros(
	dj *DJ,
	done util.BroadcastCloser,
	entry *logrus.Entry,
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
	entry.Info("Exiting FindZeros")
	watchdog.Feed()
}

package find_zeros

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/gen/go/heads"
	"go.uber.org/zap"
	"sync"
	"time"
)

func setupHead(
	sp *dj.SceneParams,
	ws *sync.WaitGroup,
	h *scene.Head,
) {
	defer ws.Done()

	conn, err := sp.DJ.HeadManager.GetConn(h.URI())
	if err != nil {
		sp.Logger.Error("error getting head connection", zap.Error(err))
		return
	}

	findHeadZero(sp, conn)
}

func findHeadZero(
	sp *dj.SceneParams,
	conn *head_manager.Connection,
) {
	ticker := time.NewTicker(1 * time.Second)

	client := heads.NewHeadClient(conn.Conn)

	_, err := client.FindZero(sp.Ctx, &heads.Empty{})
	if err != nil {
		sp.Logger.Error("error finding zero", zap.Error(err))
		return
	}

	for {
		select {
		case <-ticker.C:
			status, err := client.Status(sp.Ctx, &heads.Empty{})
			if err != nil {
				sp.Logger.Error("error polling head status", zap.Error(err))
				continue
			}

			sp.Logger.Debug("polled head status", zap.String("controller", status.Controller))

			if status.Controller != "" {
				switch status.Controller {
				case "ZeroDetector", "magnetometer zero detector":
					continue // zero detection not complete
				}
				return
			}
		case <-sp.Done.Chan():
			sp.Logger.Warn("FindZeros exited without finding all zeros")
			return
		}
	}
}

func findHeadZeros(sp *dj.SceneParams) {
	ws := &sync.WaitGroup{}

	for _, h := range sp.DJ.Scene.Heads {
		ws.Add(1)
		newSp := sp.WithLogger(sp.Logger.With(zap.String("head", h.URI())))
		go setupHead(newSp, ws, h)
	}

	ws.Wait()
	sp.Done.Close()
}

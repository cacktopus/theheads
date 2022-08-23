package find_zeros

import (
	"github.com/cacktopus/theheads/boss/dj"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"go.uber.org/zap"
)

func setupFloodLight(
	sp *dj.SceneParams,
	cameraURI string,
	state bool,
) {
	conn, err := sp.DJ.HeadManager.GetConn(cameraURI)
	if err != nil {
		sp.Logger.Error("error getting camera connection", zap.Error(err))
		return
	}

	_, err = gen.NewFloodlightClient(conn.Conn).SetState(sp.Ctx, &gen.SetStateIn{State: state})
	if err != nil {
		sp.Logger.Error("error setting floodlight state", zap.Error(err))
		return
	}
}

func setupFloodLights(sp *dj.SceneParams) {
	for _, c := range sp.DJ.Scene.Cameras {
		cameraURI := c.URI()
		newSp := sp.WithLogger(sp.Logger.With(zap.String("camera", cameraURI)))
		go setupFloodLight(newSp, cameraURI, sp.DJ.FloodlightController())
	}
}

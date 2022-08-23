package find_zeros

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/scenes"
	"github.com/cacktopus/theheads/boss/watchdog"
)

func FindZeros(sp *dj.SceneParams) {
	sp.DJ.Scene.ClearFearful()

	sp.DJ.HeadManager.CheckIn(sp.Ctx, sp.Logger, sp.DJ.Scene)

	scenes.SceneSetup(sp, "rainbow")

	go setupFloodLights(sp)
	go findHeadZeros(sp)

	<-sp.Done.Chan()
	sp.Logger.Info("Exiting FindZeros")
	watchdog.Feed()
}

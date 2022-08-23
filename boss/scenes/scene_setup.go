package scenes

import (
	"context"
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/scene"
	"sync"
	"time"
)

func SceneSetup(
	sp *dj.SceneParams,
	ledsAnimation string,
) {
	t := time.Now()

	ctx, cancel := context.WithTimeout(sp.Ctx, 250*time.Millisecond)
	defer cancel()

	var wg sync.WaitGroup

	for _, head := range sp.DJ.Scene.Heads {
		wg.Add(1)
		go func(head *scene.Head) {
			sp.DJ.HeadManager.SetLedsAnimation(ctx, sp.Logger, head.LedsURI(), ledsAnimation, t)
			wg.Done()
		}(head)
	}

	wg.Wait()
}

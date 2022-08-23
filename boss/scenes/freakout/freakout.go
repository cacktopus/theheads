package freakout

import (
	"context"
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/scenes"
	"go.uber.org/zap"
	"math/rand"
	"sync"
	"time"
)

func Freakout(sp *dj.SceneParams) {
	defer func() {
		sp.Logger.Info("done freaking out")
		sp.Done.Close()
	}()

	scenes.SceneSetup(sp, "highred")

	for _, head := range sp.DJ.Scene.Heads {
		go scenes.Track(sp, head, "Jitter", scenes.TrackClosestFocalPoint)
	}

	newCtx, cancel := context.WithTimeout(sp.Ctx, 30*time.Second)
	defer cancel()
	sp = sp.WithContext(newCtx)
	yell(sp)
	sp.DJ.Sleep(sp.Done, 10*time.Second)
}

func yell(sp *dj.SceneParams) {
	var wg sync.WaitGroup
	for _, head := range sp.DJ.Scene.Heads {
		wg.Add(1)
		go headYell(sp, &wg, head)
	}
	wg.Wait()
}

func headYell(sp *dj.SceneParams, wg *sync.WaitGroup, head *scene.Head) {
	for !isDone(sp) {
		err := sp.DJ.HeadManager.SayRandom(sp.Ctx, head.URI())
		if err != nil && !isDone(sp) {
			sp.Logger.Error("error playing random voice", zap.Error(err))
		}
		delay := (300 + time.Duration(rand.Intn(400))) * time.Millisecond
		sp.DJ.Sleep(sp.Done, delay)
	}

	func() {
		newCtx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
		defer cancel()
		if _, err := sp.DJ.HeadManager.SetActor(newCtx, head.URI(), "Seeker"); err != nil {
			sp.Logger.Error("error setting actor", zap.Error(err))
			return
		}
	}()

	wg.Done()
}

func isDone(sp *dj.SceneParams) bool {
	select {
	case <-sp.Done.Chan():
		return true
	case <-sp.Ctx.Done():
		return true
	default:
		return false
	}
}

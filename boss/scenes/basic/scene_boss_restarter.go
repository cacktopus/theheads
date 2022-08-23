package basic

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"os"
	"time"
)

func BossRestarter(sp *dj.SceneParams) {
	rate_limiter.LimitTrailing("boss.restart", time.Hour, func() {
		os.Exit(0)
	})

	sp.Done.Close()
}

package boss

import (
	"context"
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/cacktopus/theheads/common/schema"
	"go.uber.org/zap"
	"math/rand"
	"sort"
	"sync"
	"time"
)

type FpHeadPair struct {
	head *scene.Head
	fp   *schema.FocalPoint
}

type FollowConvo struct {
	once         sync.Once
	texts        []*scene.Text
	textPosition int
}

func (f *FollowConvo) Run(
	ctx context.Context,
	dj *DJ,
	done util.BroadcastCloser,
	logger *zap.Logger,
) {
	defer done.Close()
	f.setup(dj)

	for _, head := range dj.scene.Heads {
		go FollowClosestFocalPoint(ctx, logger, dj, done, head, -1.0)
	}

	f.textPosition %= len(f.texts)
	text := f.texts[f.textPosition]
	f.textPosition++

	for _, part := range text.Content {
		h0 := f.selectHead(dj)

		logger.Debug(
			"saying",
			zap.String("part", part.ID),
			zap.String("head", h0.Name),
		)

		dj.headManager.SetActor(ctx, h0.Name, "Jitter")
		dj.headManager.Say(ctx, h0.Name, part.ID)
		dj.headManager.SetActor(ctx, h0.Name, "Seeker")

		delay := (300 + time.Duration(rand.Intn(400))) * time.Millisecond
		dj.Sleep(done, delay)

		watchdog.Feed()
	}

	logger.Info("Finishing Tracking Convo")
}

func (f *FollowConvo) setup(dj *DJ) {
	f.once.Do(func() {
		// initialize texts if first run
		f.texts = append(f.texts, dj.texts...) // copy texts
		rand.Shuffle(len(f.texts), func(i, j int) {
			f.texts[i], f.texts[j] = f.texts[j], f.texts[i]
		})
	})
}

func (f *FollowConvo) selectHead(dj *DJ) *scene.Head {
	var pairs []FpHeadPair
	// find the closest (focal point, head) pairs
	for _, h := range dj.scene.Heads {
		for _, fp := range dj.grid.GetFocalPoints().FocalPoints {
			p := FpHeadPair{
				head: h,
				fp:   fp,
			}
			pairs = append(pairs, p)
		}
	}

	sort.Slice(pairs, func(i, j int) bool {
		vi := geom.NewVec(pairs[i].fp.Pos.X, pairs[i].fp.Pos.Y)
		vj := geom.NewVec(pairs[j].fp.Pos.X, pairs[j].fp.Pos.Y)
		d0 := pairs[i].head.GlobalPos().Sub(vi).AbsSq()
		d1 := pairs[j].head.GlobalPos().Sub(vj).AbsSq()
		return d0 < d1
	})

	var choices []FpHeadPair

	if len(pairs) == 0 {
		i := rand.Intn(len(dj.scene.HeadList))
		return dj.scene.HeadList[i]
	}

	// Choose a random head to speak with some bias
	if len(pairs) >= 1 {
		choices = append(choices, pairs[0], pairs[0], pairs[0])
	}

	if len(pairs) >= 2 {
		choices = append(choices, pairs[1], pairs[1])
	}

	if len(pairs) >= 3 {
		choices = append(choices, pairs[2])
	}

	i := rand.Intn(len(choices))
	choice := choices[i]

	return choice.head
}

package follow_convo

import (
	"github.com/cacktopus/theheads/boss/dj"
	"github.com/cacktopus/theheads/boss/rate_limiter"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/scenes"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/cacktopus/theheads/common/geom"
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

func (f *FollowConvo) Run(sp *dj.SceneParams) {
	defer sp.Done.Close()
	defer sp.Logger.Info("Finishing Tracking Convo")
	f.setup(sp.DJ)

	//go f.interruptScene(sp, randomlyInterrupt())
	go f.interruptScene(sp, fearfulInterrupt(sp, sp.DJ.Boss.Env.FearfulCount, 90*time.Second))

	scenes.SceneSetup(sp, "rainbow")

	for _, head := range sp.DJ.Scene.Heads {
		go scenes.Track(sp, head, "Seeker", scenes.TrackEvadeFocalPoint)
		go scenes.EnableFaceDetection(sp, head)
	}

	f.textPosition %= len(f.texts)
	text := f.texts[f.textPosition]
	f.textPosition++

	for _, part := range text.Content {
		select {
		case <-sp.Done.Chan():
			return
		default:
		}

		h0 := f.selectHead(sp.DJ)

		sp.Logger.Debug(
			"saying",
			zap.String("part", part.ID),
			zap.String("head", h0.URI()),
		)

		sp.DJ.HeadManager.SetActor(sp.Ctx, h0.URI(), "Jitter")
		sp.DJ.HeadManager.Say(sp.Ctx, sp.Logger, h0.URI(), part.ID)
		sp.DJ.HeadManager.SetActor(sp.Ctx, h0.URI(), "Seeker")

		delay := (300 + time.Duration(rand.Intn(400))) * time.Millisecond
		sp.DJ.Sleep(sp.Done, delay)

		watchdog.Feed()
	}
}

func (f *FollowConvo) setup(dj *dj.DJ) {
	f.once.Do(func() {
		// initialize texts if first run
		f.texts = append(f.texts, dj.Scene.Texts...) // copy texts
		rand.Shuffle(len(f.texts), func(i, j int) {
			f.texts[i], f.texts[j] = f.texts[j], f.texts[i]
		})
	})
}

func (f *FollowConvo) selectHead(dj *dj.DJ) *scene.Head {
	var pairs []FpHeadPair
	// find the closest (focal point, head) pairs
	for _, h := range dj.Scene.Heads {
		if h.Fearful() {
			continue // fearful heads don't normally speak
		}

		for _, fp := range dj.Grid.GetFocalPoints().FocalPoints {
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
		i := rand.Intn(len(dj.Scene.HeadList))
		return dj.Scene.HeadList[i]
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

func (f *FollowConvo) interruptScene(
	sp *dj.SceneParams,
	shouldInterrupt func() bool,
) {
	t := time.NewTicker(250 * time.Millisecond)
	defer t.Stop()

	for {
		select {
		case <-sp.Done.Chan():
			return
		case <-t.C:
			if shouldInterrupt() {
				sp.DJ.InterruptWithScene(sp.Done, "freakout")
				return
			}
		}
	}
}

func randomlyInterrupt() func() bool {
	doInterrupt := rand.Float64() < 0.5
	when := time.Now().Add(time.Duration(5+rand.Intn(30)) * time.Second)

	return func() bool {
		if !doInterrupt {
			return false
		}
		return time.Now().After(when)
	}
}

func fearfulInterrupt(
	sc *dj.SceneParams,
	n int,
	cooldown time.Duration,
) func() bool {
	return func() bool {
		count := 0
		for _, head := range sc.DJ.Scene.Heads {
			if head.Fearful() {
				count++
			}
		}

		if count < n {
			return false
		}

		var result bool
		rate_limiter.Debounce("fearful-interrupt", cooldown, func() {
			result = true
		})
		return result
	}
}

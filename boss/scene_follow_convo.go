package main

import (
	"fmt"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/util"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"math/rand"
	"sort"
	"time"
)

type FpHeadPair struct {
	head *scene.Head
	fp   *grid.FocalPoint
}

type FpHeadPairs []FpHeadPair

func (p FpHeadPairs) Len() int {
	return len(p)
}

func (p FpHeadPairs) Less(i, j int) bool {
	di := p[i].head.GlobalPos().Sub(p[i].fp.Pos).AbsSq()
	dj := p[j].head.GlobalPos().Sub(p[j].fp.Pos).AbsSq()

	return di < dj

}

func (p FpHeadPairs) Swap(i, j int) {
}

type FollowConvo struct {
	texts        []*Text
	textPosition int
}

func (f *FollowConvo) Run(dj *DJ, done util.BroadcastCloser, entry *logrus.Entry) {
	// initialize texts if first run
	if f.texts == nil {
		// copy texts
		f.texts = append(f.texts, dj.texts...)
		rand.Shuffle(len(f.texts), func(i, j int) {
			f.texts[i], f.texts[j] = f.texts[j], f.texts[i]
		})
	}

	for _, head := range dj.scene.Heads {
		go FollowClosestFocalPoint(dj, done, head, -1.0)
	}

	f.textPosition %= len(f.texts)
	text := f.texts[f.textPosition]
	f.textPosition++

	selectHead := func(pairs FpHeadPairs, allHeads []*scene.Head) *scene.Head {
		var choices FpHeadPairs

		if len(pairs) == 0 {
			i := rand.Intn(len(allHeads))
			return allHeads[i]
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

	for _, part := range text.Content {
		var pairs FpHeadPairs
		// find closest focal point + head pairs
		for _, h := range dj.scene.Heads {
			for _, fp := range dj.grid.GetFocalPoints() {
				p := FpHeadPair{head: h, fp: fp}
				pairs = append(pairs, p)
			}
		}

		sort.Sort(pairs)

		h0 := selectHead(pairs, dj.scene.HeadList)

		logrus.WithFields(logrus.Fields{
			"part": part.ID,
			"head": h0.Name,
		}).Debug("saying")
		playPath := fmt.Sprintf("/play?sound=%s", part.ID)
		result := dj.headManager.SendWithResult("voices", h0.Name, playPath, nil)
		if result.Err != nil {
			logrus.WithError(result.Err).Error("error playing sound")
		}

		delay := (300 + time.Duration(rand.Intn(400))) * time.Millisecond
		dj.Sleep(done, delay)

		watchdog.Feed()
	}

	logrus.Info("Finishing Tracking Convo")
	done.Close()
}

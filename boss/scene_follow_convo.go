package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/cacktopus/heads/boss/util"
	"github.com/cacktopus/heads/boss/watchdog"
	"github.com/sirupsen/logrus"
	"math/rand"
	"sort"
	"time"
)

type FpHeadPair struct {
	head *scene.Head
	fp   *FocalPoint
}

type FpHeadPairs []FpHeadPair

func (p FpHeadPairs) Len() int {
	return len(p)
}

func (p FpHeadPairs) Less(i, j int) bool {
	di := p[i].head.GlobalPos().Sub(p[i].fp.pos).AbsSq()
	dj := p[j].head.GlobalPos().Sub(p[j].fp.pos).AbsSq()

	return di < dj

}

func (p FpHeadPairs) Swap(i, j int) {
}

func FollowConvo(dj *DJ, done util.BroadcastCloser) {
	for _, head := range dj.scene.Heads {
		go FollowClosestFocalPoint(dj, done, head, -1.0)
	}

	text := randomText(dj.texts)

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
			for _, fp := range dj.grid.focalPoints {
				p := FpHeadPair{head: h, fp: fp}
				pairs = append(pairs, p)
			}
		}

		sort.Sort(pairs)

		h0 := selectHead(pairs, dj.scene.HeadList)

		logrus.WithFields(logrus.Fields{
			"part": part.ID,
			"head": h0.Name,
		}).Info("saying")
		playPath := fmt.Sprintf("/play?sound=%s", part.ID)
		result := dj.headManager.sendWithResult("voices", h0.Name, playPath, nil)
		if result.Err != nil {
			logrus.WithError(result.Err).Error("error playing sound")
		}

		delay := (300 + time.Duration(rand.Intn(400))) * time.Millisecond
		dj.Sleep(done, delay)

		watchdog.Feed()
	}

	logrus.Println("Finishing Tracking Convo")
	done.Close()
}

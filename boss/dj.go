package main

import (
	"github.com/cacktopus/heads/boss/scene"
	"github.com/cacktopus/heads/boss/util"
	"github.com/sirupsen/logrus"
	"time"
)

type SceneRunner func(dj *DJ, done util.BroadcastCloser)

type SceneConfig struct {
	Runner           SceneRunner
	MaxLengthSeconds uint
}

type DJ struct {
	grid        *Grid
	scene       *scene.Scene
	headManager *HeadManager
	texts       []*Text
}

func (dj *DJ) RunScenes() {
	for {
		for _, sceneName := range dj.scene.Scenes {
			logrus.WithField("scene", sceneName).Info("Running Scene")
			done := util.NewBroadcastCloser()
			sc := AllScenes[sceneName]
			go sc.Runner(dj, done)

			maxLength := time.Duration(sc.MaxLengthSeconds) * time.Second
			dj.Sleep(done, maxLength)
			done.Close()
		}
	}
}

func (dj *DJ) Sleep(done util.BroadcastCloser, duration time.Duration) bool {
	select {
	case <-time.After(duration):
		return false
	case <-done.Chan():
		return true
	}
}

var AllScenes = map[string]SceneConfig{
	"in_n_out":     {InNOut, 60},
	"follow_evade": {FollowEvade, 60},
	"conversation": {Conversation, 5 * 60},
	"find_zeros":   {FindZeros, 30},
	"idle":         {Idle, 60},
}

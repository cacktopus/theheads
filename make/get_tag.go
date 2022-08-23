package main

import "sync"

var getTagOnce sync.Once
var tag_ string

func getTag() string {
	getTagOnce.Do(func() {
		tag_ = output(nil, "git", "describe", "--tags", "--dirty")
		if tag_ == "" {
			panic("no tag")
		}
	})
	return tag_
}

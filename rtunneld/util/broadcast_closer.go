package util

import "sync"

type broadcastCloser struct {
	ch   chan interface{}
	once sync.Once
}

func (b *broadcastCloser) Close() {
	b.once.Do(func() {
		close(b.ch)
	})
}

func (b *broadcastCloser) Chan() <-chan interface{} {
	return b.ch
}

type BroadcastCloser interface {
	Close()
	Chan() <-chan interface{}
}

func NewBroadcastCloser() BroadcastCloser {
	b := &broadcastCloser{}
	b.ch = make(chan interface{})
	return b
}

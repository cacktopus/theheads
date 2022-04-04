package main

import (
	"sync"
	"time"
)

// TODO: move to common, share with boss

type Debouncer struct {
	debounceUntil map[string]time.Time
	mu            sync.Mutex
}

func NewDebouncer() *Debouncer {
	return &Debouncer{debounceUntil: map[string]time.Time{}}
}

func (d *Debouncer) Debounce(name string, duration time.Duration, callback func()) {
	//TODO: probably need a background reaper or this could grow unbounded
	now := time.Now()

	d.mu.Lock()
	end, ok := d.debounceUntil[name]
	d.mu.Unlock()

	if !ok || now.After(end) {
		callback()
		d.mu.Lock()
		d.debounceUntil[name] = now.Add(duration)
		d.mu.Unlock()
	}
}

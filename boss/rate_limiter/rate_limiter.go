package rate_limiter

import (
	"sync"
	"time"
)

var calledAt = map[string]time.Time{}
var debounceUntil = map[string]time.Time{}
var mu sync.Mutex

func LimitTrailing(name string, duration time.Duration, callback func()) {
	// trailing edge trigger

	now := time.Now()

	mu.Lock()
	at, ok := calledAt[name]
	mu.Unlock()

	if ok {
		callAfter := at.Add(duration)
		if now.After(callAfter) {
			callback()
			mu.Lock()
			calledAt[name] = now
			mu.Unlock()
		}
	} else {
		mu.Lock()
		calledAt[name] = now
		mu.Unlock()
	}
}

func Debounce(name string, duration time.Duration, callback func()) {
	//TODO: probably need a background reaper or this could grow unbounded
	now := time.Now()

	mu.Lock()
	end, ok := debounceUntil[name]
	mu.Unlock()

	if !ok || now.After(end) {
		callback()
		mu.Lock()
		debounceUntil[name] = now.Add(duration)
		mu.Unlock()
	}
}

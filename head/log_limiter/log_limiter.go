package log_limiter

import (
	"sync"
	"time"
)

type Limiter struct {
	duration time.Duration
	timer    *time.Timer
	lock     sync.Mutex
	blocked  bool
}

func NewLimiter(duration time.Duration) *Limiter {
	return &Limiter{
		duration: duration,
		timer:    time.NewTimer(duration),
	}
}

func (ll *Limiter) Do(callback func()) {
	run := func() bool {
		ll.lock.Lock()
		defer ll.lock.Unlock()

		if ll.blocked {
			return false
		}

		ll.blocked = true
		ll.timer.Reset(ll.duration)

		go func() {
			<-ll.timer.C
			ll.lock.Lock()
			defer ll.lock.Unlock()
			ll.blocked = false
		}()

		return true
	}()

	if run {
		callback()
	}
}

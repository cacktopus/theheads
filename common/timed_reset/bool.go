package timed_reset

import (
	"sync"
	"time"
)

const minDelay = time.Millisecond

type Bool struct {
	val   bool
	until time.Time

	lock  sync.Mutex
	timer *time.Timer

	created time.Time
}

// NewBool (in its current implementation) probably leaks a channel
// You should only create these if you never plan on destroying them
func NewBool() *Bool {
	b := &Bool{
		timer:   time.NewTimer(time.Hour),
		created: time.Now(),
	}
	b.Clear()

	go b.expireLoop()

	return b
}

func (b *Bool) Val() bool {
	b.lock.Lock()
	defer b.lock.Unlock()
	//fmt.Println(b.when(), "read", b.val)
	return b.val
}

func (b *Bool) SetFor(duration time.Duration) {
	b.lock.Lock()
	defer b.lock.Unlock()

	newUntil := time.Now().Add(duration)
	if newUntil.After(b.until) {
		// TODO: test for this case
		b.until = newUntil
		b.reset()
	}

	b.val = true
}

// reset should only be called while lock already held
func (b *Bool) reset() {
	duration := b.until.Sub(time.Now())

	if duration < minDelay {
		duration = minDelay
	}

	if !b.timer.Stop() {
		// attempt to clear the channel
		select {
		case <-b.timer.C:
		default:
		}
	}

	//fmt.Println(b.when(), "reset to", duration)
	b.timer.Reset(duration)
}

func (b *Bool) Clear() {
	b.lock.Lock()
	defer b.lock.Unlock()

	if !b.timer.Stop() {
		// attempt to clear the channel
		select {
		case <-b.timer.C:
		default:
		}
	}

	b.val = false
}

func (b *Bool) expireLoop() {
	for range b.timer.C {
		//fmt.Println(b.when(), "timer fired in expire loop")
		func() {
			b.lock.Lock()
			defer b.lock.Unlock()

			if time.Now().After(b.until) {
				//fmt.Println(b.when(), "unset")
				b.val = false
			} else {
				//fmt.Println(b.when(), "expiry is in the future")
				b.reset()
			}
		}()
	}
}

func (b *Bool) when() time.Duration {
	return time.Now().Sub(b.created)
}

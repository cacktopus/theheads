package rate_limiter

import (
	"github.com/sirupsen/logrus"
	"sync"
	"time"
)

var calledAt = map[string]time.Time{}
var mu sync.Mutex

func Limit(name string, duration time.Duration, callback func()) {
	// trailing edge trigger

	now := time.Now()

	mu.Lock()
	at, ok := calledAt[name]
	logrus.WithField("at", at).WithField("ok", ok).Info("at")
	mu.Unlock()

	if ok {
		callAfter := at.Add(duration)
		logrus.WithField("after", callAfter).Info("at")
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

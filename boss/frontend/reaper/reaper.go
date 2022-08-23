package reaper

import (
	"container/heap"
	"sync"
	"time"
)

type item struct {
	description string
	callback    func()
	expire      time.Time
}

type queue []*item

func (q queue) Len() int {
	return len(q)
}

func (q queue) Less(i, j int) bool {
	return q[i].expire.Before(q[j].expire)
}

func (q queue) Swap(i, j int) {
	q[i], q[j] = q[j], q[i]
}

func (q *queue) Push(x interface{}) {
	*q = append(*q, x.(*item))
}

func (q *queue) Pop() interface{} {
	old := *q
	n := len(old)
	item := old[n-1]
	*q = old[0 : n-1]
	return item
}

type Reaper struct {
	data     queue
	lock     sync.Mutex
	checkNow chan bool
}

func NewReaper() *Reaper {
	return &Reaper{
		checkNow: make(chan bool),
	}
}

func (r *Reaper) Add(description string, expire time.Time, callback func()) {
	func() {
		r.lock.Lock()
		defer r.lock.Unlock()

		heap.Push(&r.data, &item{
			description: description,
			callback:    callback,
			expire:      expire,
		})
	}()

	r.checkNow <- true
}

func (r *Reaper) Run() {
	// start out with any delay here, we'll be resetting it
	timer := time.AfterFunc(time.Hour, func() {
		r.checkNow <- true
	})

	go func() {
		for {
			<-r.checkNow
			delay := r.check(time.Now())
			if delay > 0 {
				timer.Reset(delay)
			}
		}
	}()
}

func (r *Reaper) check(now time.Time) time.Duration {
	var toRemove []*item

	var delta time.Duration

	func() {
		r.lock.Lock()
		defer r.lock.Unlock()

		for r.data.Len() > 0 {
			popped := heap.Pop(&r.data)
			it := popped.(*item)
			if now.After(it.expire) {
				toRemove = append(toRemove, it)
			} else {
				heap.Push(&r.data, popped)
				delta = it.expire.Sub(now)
				break
			}
		}
	}()

	for _, it := range toRemove {
		it.callback()
	}

	return delta
}

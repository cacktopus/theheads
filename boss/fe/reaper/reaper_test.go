package reaper

import (
	"container/heap"
	"fmt"
	"github.com/stretchr/testify/require"
	"math/rand"
	"testing"
	"time"
)

func TestHeap(t *testing.T) {
	r := NewReaper()

	now := time.Now()

	ints := []int{1, 2, 3, 4, 5, 6, 7, 8}
	rand.Shuffle(len(ints), func(i, j int) {
		ints[i], ints[j] = ints[j], ints[i]
	})

	fmt.Println(ints)

	for _, i := range ints {
		heap.Push(&r.data, &item{
			description: fmt.Sprintf("%d", i),
			expire:      now.Add(time.Duration(i) * time.Second),
		})
	}

	for i := 1; i <= 8; i++ {
		t.Run(fmt.Sprintf("pop %d", i), func(t *testing.T) {
			popped := heap.Pop(&r.data)
			rem := popped.(*item)
			require.Equal(t, fmt.Sprintf("%d", i), rem.description)
		})
	}
}

func TestCheck(t *testing.T) {
	r := NewReaper()

	now := time.Now()

	halfSecond := 500 * time.Millisecond

	ints := []int{2, 3, 5, 8, 13, 21}
	rand.Shuffle(len(ints), func(i, j int) {
		ints[i], ints[j] = ints[j], ints[i]
	})

	for _, i := range ints {
		i := i
		heap.Push(&r.data, &item{
			description: fmt.Sprintf("%d", i),
			expire:      now.Add(time.Duration(i) * time.Second),
			callback: func() {
				fmt.Println("called", i)
			},
		})
	}

	delay := r.check(now.Add(halfSecond))
	require.Equal(t, 1500*time.Millisecond, delay)
	require.Equal(t, 6, r.data.Len())

	delay = r.check(now.Add(4 * time.Second).Add(halfSecond))
	require.Equal(t, 500*time.Millisecond, delay)
	require.Equal(t, 4, r.data.Len())

	delay = r.check(now.Add(22 * time.Second))
	require.Equal(t, 0*time.Millisecond, delay)
	require.Equal(t, 0, r.data.Len())
}

func TestReaper(t *testing.T) {
	r := NewReaper()
	go r.Run()

	ints := []int{2, 3, 5, 8, 13, 21}
	rand.Shuffle(len(ints), func(i, j int) {
		ints[i], ints[j] = ints[j], ints[i]
	})

	now := time.Now()

	for _, i := range ints {
		i := i
		r.Add(fmt.Sprintf("%d", i), now.Add(time.Duration(i)*time.Second), func() {
			fmt.Println("called", i, time.Now().Sub(now))
		})
	}

	time.Sleep(22 * time.Second)
}

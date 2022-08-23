package timed_reset

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestBool(t *testing.T) {
	b := NewBool()

	t.Run("basics", func(t *testing.T) {
		assert.Equal(t, false, b.Val())

		b.SetFor(100 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		time.Sleep(50 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		time.Sleep(100 * time.Millisecond)
		assert.Equal(t, false, b.Val())
	})

	t.Run("multiple sets", func(t *testing.T) {
		b.SetFor(100 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		time.Sleep(50 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		b.SetFor(100 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		time.Sleep(50 * time.Millisecond)
		assert.Equal(t, true, b.Val())

		time.Sleep(100 * time.Millisecond)
		assert.Equal(t, false, b.Val())
	})
}

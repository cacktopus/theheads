package leds

import (
	"github.com/stretchr/testify/assert"
	"testing"
	"time"
)

func TestTime(t *testing.T) {
	assert.True(t, time.Now().After(time.UnixMicro(0)))
}

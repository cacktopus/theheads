package main

import (
	"github.com/ory/dockertest/v3"
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_All(t *testing.T) {
	pool, err := dockertest.NewPool("")
	assert.NoError(t, err)
	_ = pool
}

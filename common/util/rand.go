package util

import (
	crypto "crypto/rand"
	"encoding/binary"
	"math/rand"
	"time"
)

func SetRandSeed() {
	var buf [8]byte
	_, err := crypto.Read(buf[:])
	if err != nil {
		panic(err)
	}

	a := binary.BigEndian.Uint64(buf[:])

	rand.Seed(int64(a))
}

func RandomDuration(maxDuration time.Duration) time.Duration {
	return time.Duration(rand.Int63n(int64(maxDuration)))
}

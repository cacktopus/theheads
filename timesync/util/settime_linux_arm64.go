package util

import (
	"math"
	"syscall"
)

func SetTime(max float64) error {
	whole, frac := math.Modf(max)
	tv := syscall.Timeval{
		Sec:  int64(whole),
		Usec: int64(frac * 1e6),
	}

	return syscall.Settimeofday(&tv)
}

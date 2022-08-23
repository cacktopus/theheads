package util

import (
	"syscall"
	"time"
)

func SetTime(time time.Time) error {
	tv := syscall.Timeval{
		Sec:  time.Unix(),
		Usec: int64(time.Nanosecond() / 1e3),
	}
	return syscall.Settimeofday(&tv)
}

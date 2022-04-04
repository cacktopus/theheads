package util

import "time"

func Now() float64 {
	return TimeToFloat64(time.Now())
}

func TimeToFloat64(t time.Time) float64 {
	return float64(t.UnixNano()) / float64(time.Second)
}

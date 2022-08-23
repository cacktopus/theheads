package util

import (
	"errors"
	"time"
)

func SetTime(max time.Time) error {
	return errors.New("not setting time on darwin")
}

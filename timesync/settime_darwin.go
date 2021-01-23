package main

import (
	"errors"
)

func setTime(max float64) error {
	return errors.New("not setting time on darwin")
}

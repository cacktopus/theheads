package retry

import "time"

func Retry(times int, delay time.Duration, callback func(attempt int) error) error {
	var err error
	for i := 0; i < times; i++ {
		err = callback(i + 1)
		if err == nil {
			return nil
		}
		time.Sleep(delay)
	}
	return err
}

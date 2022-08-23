package time_based

import "time"

type Detector struct {
	sunrise time.Duration
	sunset  time.Duration
}

func NewDetector(args ...string) *Detector {
	sunrise, err := time.ParseDuration(args[0])
	if err != nil {
		panic(err)
	}

	sunset, err := time.ParseDuration(args[1])
	if err != nil {
		panic(err)
	}

	return &Detector{
		sunrise: sunrise,
		sunset:  sunset,
	}
}

func (d *Detector) IsDay() bool {
	now := time.Now()
	midnight := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)

	sunrise := midnight.Add(d.sunrise)
	sunset := midnight.Add(d.sunset)

	day := now.After(sunrise) && now.Before(sunset)
	return day
}

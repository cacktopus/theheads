package cfg

import "time"

type Config struct {
	Port     int           `envconfig:"default=8086"`
	RTC      bool          `envconfig:"optional"`
	Interval time.Duration `envconfig:"default=60s"`

	MinSources int `envconfig:"default=2"`
}

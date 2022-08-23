package heads_cli

import (
	"github.com/cacktopus/theheads/timesync/rtc"
	"github.com/pkg/errors"
	"time"
)

const timeFormat = "2006-01-02T15:04:05"

type setRTCTimeCommand struct {
	Time string `long:"time" description:"time to set; use UTC (format: 2022-04-09T04:19:18); default is to sync rtc time to current system time"`
}

func (s *setRTCTimeCommand) Execute(args []string) error {
	rtClock, err := rtc.SetupI2C()
	if err != nil {
		return errors.Wrap(err, "setup i2c")
	}

	when := time.Now().UTC()
	if s.Time != "" {
		when, err = time.Parse(timeFormat, s.Time)
		if err != nil {
			return errors.Wrap(err, "parse time")
		}
	}

	err = rtClock.SetTime(when.UTC())
	if err != nil {
		panic(err)
	}

	return nil
}

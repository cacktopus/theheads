package heads_cli

import (
	"github.com/cacktopus/theheads/timesync/rtc"
	"time"
)

type setTimeCommand struct {
	Time string `long:"time" description:"time to set; use UTC (format: 2022-04-09 04:19:18)"`
}

func (s *setTimeCommand) Execute(args []string) error {
	rtClock, err := rtc.SetupI2C()
	if err != nil {
		panic(err)
	}

	when := time.Now().UTC()
	if s.Time != "" {
		when, err = time.Parse("2006-01-02 15:04:05", s.Time)
		if err != nil {
			panic(err)
		}
	}

	err = rtClock.SetTime(when.UTC())
	if err != nil {
		panic(err)
	}

	return nil
}

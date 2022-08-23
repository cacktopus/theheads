package heads_cli

import (
	"fmt"
	"github.com/cacktopus/theheads/timesync/rtc"
	"github.com/pkg/errors"
	"time"
)

type readRTCTimeCommand struct {
}

func (s *readRTCTimeCommand) Execute(args []string) error {
	fmt.Println("SYS:", time.Now().UTC().Format(timeFormat))

	rtClock, err := rtc.SetupI2C()
	if err != nil {
		fmt.Println("RTC:", errors.Wrap(err, "setup i2c").Error())
		return nil
	}

	t, err := rtClock.ReadTime()
	if err != nil {
		fmt.Println("RTC:", errors.Wrap(err, "setup i2c").Error())
		return nil
	}

	fmt.Println("RTC:", t.Format(timeFormat))
	return nil
}

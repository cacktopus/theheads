package heads_cli

import (
	"fmt"
	"github.com/cacktopus/theheads/timesync/rtc"
)

type readTimeCommand struct {
}

func (s *readTimeCommand) Execute(args []string) error {
	rtClock, err := rtc.SetupI2C()
	if err != nil {
		panic(err)
	}

	time, err := rtClock.ReadTime()
	if err != nil {
		panic(err)
	}

	fmt.Println(time.String())
	return nil
}

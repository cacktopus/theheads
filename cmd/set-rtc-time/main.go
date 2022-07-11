package main

import (
	"fmt"
	"github.com/cacktopus/theheads/timesync/rtc"
	"github.com/cacktopus/theheads/timesync/util"
)

func main() {
	rtClock, err := rtc.SetupI2C()
	if err != nil {
		fmt.Println("error setting up i2c:", err.Error())
		return
	}

	t, err := rtClock.ReadTime()
	if err != nil {
		fmt.Println("error reading rtc time:", err.Error())
		return
	}

	fmt.Println("setting system time:", t.String())
	err = util.SetTime(util.TimeToFloat64(t))
	if err != nil {
		fmt.Println("error setting system time:", err.Error())
		return
	}
}

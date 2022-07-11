package main

import (
	"fmt"
	"github.com/cacktopus/theheads/solar"
	"os"
)

func main() {
	err := solar.Run()
	if err != nil {
		_, _ = fmt.Fprintf(os.Stderr, "error: %s", err.Error())
		os.Exit(-1)
	}
}

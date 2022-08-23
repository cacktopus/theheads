package main

import (
	"github.com/cacktopus/theheads/heads-cli"
	"os"
)

func main() {
	err := heads_cli.Run()
	if err != nil {
		os.Exit(-1)
	}
}

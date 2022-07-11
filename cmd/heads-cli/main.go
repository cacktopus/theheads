package main

import "github.com/cacktopus/theheads/heads-cli"

func main() {
	err := heads_cli.Run()
	if err != nil {
		panic(err)
	}
}

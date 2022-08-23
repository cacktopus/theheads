package main

import (
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/web"
)

func main() {
	web.Run(discovery.NewSerf("127.0.0.1:7373"))
}

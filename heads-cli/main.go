package main

import (
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
)

var root struct{}

func main() {
	err := run()
	if err != nil {
		panic(err)
	}
}

func run() error {
	parser := flags.NewParser(&root, flags.Default)

	for _, c := range []struct {
		Name string
		Data interface{}
	}{
		{Name: "sync", Data: &syncCommand},
		{Name: "ips", Data: &ipsCommand},
		{Name: "assign-ip", Data: &assignIPsCommand},
		{Name: "all", Data: &allCommand{}},
		{Name: "volume", Data: &volumeCmd{}},
		{Name: "motor-off", Data: &MotorOffCmd{}},
		{Name: "find-zero", Data: &FindZeroCmd{}},
		{Name: "leds", Data: &LedsCmd{}},
		{Name: "tftp", Data: &TftpCmd{}},
	} {
		_, err := parser.AddCommand(c.Name, "", "", c.Data)
		if err != nil {
			return errors.Wrap(err, "add command")
		}
	}

	_, err := parser.Parse()
	return errors.Wrap(err, "parse args")
}

package heads_cli

import (
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
)

var root struct{}

func Run() error {
	parser := flags.NewParser(&root, flags.Default)

	for _, c := range []struct {
		Name string
		Data interface{}
	}{
		{Name: "all", Data: &allCommand{}},
		{Name: "assign-ip", Data: &assignIPsCommand},
		{Name: "diag", Data: &DiagCmd{}},
		{Name: "discover", Data: &DiscoverCmd{}},
		{Name: "find-zero", Data: &FindZeroCmd{}},
		{Name: "ips", Data: &ipsCommand},
		{Name: "leds", Data: &LedsCmd{}},
		{Name: "motor-off", Data: &MotorOffCmd{}},
		{Name: "read-time", Data: &readTimeCommand{}},
		{Name: "set-time", Data: &setTimeCommand{}},
		{Name: "stream-logs", Data: &streamLogsCommand{}},
		{Name: "sync", Data: &syncCommand},
		{Name: "tftp", Data: &TftpCmd{}},
		{Name: "volume", Data: &volumeCmd{}},
	} {
		_, err := parser.AddCommand(c.Name, "", "", c.Data)
		if err != nil {
			return errors.Wrap(err, "add command")
		}
	}

	_, err := parser.Parse()
	return errors.Wrap(err, "parse args")
}

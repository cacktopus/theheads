package heads_cli

import (
	"github.com/cacktopus/theheads/heads-cli/logs"
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
)

var root struct{}

const settingSystemTime = `
This is for setting the rtc time.

To set the *system* time manually, use:

date '+%s'

... on one host, and e.g.:

sudo date -s '@1659544896'

... on another
`

func Run() error {
	parser := flags.NewParser(&root, flags.Default)

	for _, c := range []struct {
		Name            string
		Data            interface{}
		LongDescription string
	}{
		{Name: "all", Data: &allCommand{}},
		{Name: "assign-ip", Data: &assignIPsCommand},
		{Name: "diag", Data: &DiagCmd{}},
		{Name: "discover", Data: &DiscoverCmd{}},
		{Name: "env2dict", Data: &Env2DictCmd{}},
		{Name: "find-zero", Data: &FindZeroCmd{}},
		{Name: "ips", Data: &ipsCommand},
		{Name: "leds", Data: &LedsCmd{}},
		{Name: "motor-off", Data: &MotorOffCmd{}},
		{Name: "read-rtc-time", Data: &readRTCTimeCommand{}},
		{Name: "set-rtc-time", Data: &setRTCTimeCommand{}, LongDescription: settingSystemTime},
		{Name: "stream-logs", Data: &logs.StreamLogsCommand{}},
		{Name: "sync", Data: &syncCommand},
		{Name: "test-stepping", Data: &TestSteppingCmd{}},
		{Name: "tftp", Data: &TftpCmd{}},
		{Name: "volume", Data: &volumeCmd{}},
		{Name: "plot-magnet", Data: &PlotMagnetCmd{}},
		{Name: "position", Data: &PositionCmd{}},
	} {
		_, err := parser.AddCommand(c.Name, "", c.LongDescription, c.Data)
		if err != nil {
			return errors.Wrap(err, "add command")
		}
	}

	_, err := parser.Parse()
	switch errT := err.(type) {
	case nil:
		return nil
	case *flags.Error:
		switch errT.Type {
		case flags.ErrHelp:
			return nil
		}
		return err
	}

	return errors.Wrap(err, "parse args")
}

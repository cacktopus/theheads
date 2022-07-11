package heads_cli

import (
	"github.com/cacktopus/theheads/heads-cli/diag"
)

type DiagCmd struct {
	Host string `long:"host" description:"host to diagnose" required:"true"`
}

func (opt *DiagCmd) Execute(args []string) error {
	diag.Run(opt.Host)
	return nil
}

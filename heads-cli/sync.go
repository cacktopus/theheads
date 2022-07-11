package heads_cli

import (
	"fmt"
	"github.com/cacktopus/theheads/heads-cli/lib"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"os"
	"os/exec"
	"path/filepath"
)

type syncCommand_ struct {
	Match  string `long:"match" description:"host pattern to match" default:"."`
	Srcdir string `long:"srcdir" description:"source directory" default:"$HOME/shared"`
}

func (s *syncCommand_) Execute(args []string) error {
	return sync(s)
}

var syncCommand syncCommand_

func sync(opt *syncCommand_) error {
	return lib.AllHosts(opt.Match, func(m *client.Member) error {
		fmt.Println(m.Name)
		dst := fmt.Sprintf("static@%s:", m.Addr.String())
		src := filepath.Clean(os.ExpandEnv(opt.Srcdir)) + "/"

		cmd := exec.Command("rsync", "-av", src, dst)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		fmt.Println(cmd.String())
		err := cmd.Run()
		return errors.Wrap(err, "run")
	})
}

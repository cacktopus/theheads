package heads_cli

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/cacktopus/theheads/heads-cli/lib"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
)

type LedsCmd struct {
	Match string `long:"match" description:"host pattern to match" default:"^head"`
	Name  string `long:"name" description:"name of animation to run" required:"true"`
}

func (opt *LedsCmd) Execute(args []string) error {
	return lib.ConnectAll(opt.Match, 8082, func(ctx context.Context, m *client.Member, conn *grpc.ClientConn) error {
		fmt.Println("leds for", m.Name)

		_, err := heads.NewLedsClient(conn).Run(ctx, &heads.RunIn{Name: opt.Name})
		return errors.Wrap(err, "leds")
	})
}

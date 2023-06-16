package heads_cli

import (
	"context"
	"fmt"
	heads2 "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/cacktopus/theheads/heads-cli/lib"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
)

type MotorOffCmd struct {
	Match string `long:"match" description:"host pattern to match" default:"^head"`
}

func (opt *MotorOffCmd) Execute(args []string) error {
	return lib.ConnectAll(opt.Match, 8080, func(ctx context.Context, m *client.Member, conn *grpc.ClientConn) error {
		fmt.Println("motor off for", m.Name)

		_, err := heads2.NewHeadClient(conn).MotorOff(ctx, &heads2.Empty{})
		return errors.Wrap(err, "motor off")
	})
}

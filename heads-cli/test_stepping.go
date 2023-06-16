package heads_cli

import (
	"context"
	"fmt"
	heads2 "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/cacktopus/theheads/heads-cli/lib"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"math/rand"
	"time"
)

type TestSteppingCmd struct {
	Match string `long:"match" description:"host pattern to match" default:"^head"`
}

func (opt *TestSteppingCmd) Execute(args []string) error {
	for {
		err := lib.ConnectAll(opt.Match, 8080, func(ctx context.Context, m *client.Member, conn *grpc.ClientConn) error {
			return opt.run(m, conn)
		})
		if err != nil {
			return errors.Wrap(err, "connect all")
		}
	}
}

func (opt *TestSteppingCmd) run(m *client.Member, conn *grpc.ClientConn) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
	defer cancel()
	fmt.Println("find zero for", m.Name)

	client := heads2.NewHeadClient(conn)
	_, err := client.FindZero(ctx, &heads2.Empty{})
	if err != nil {
		return errors.Wrap(err, "find zero")
	}
	time.Sleep(time.Minute)

	target := rand.Float64() * 360.0
	fmt.Println("set target for", m.Name, target)
	_, err = client.SetTarget(ctx, &heads2.SetTargetIn{
		Theta: target,
	})
	if err != nil {
		return errors.Wrap(err, "set target")
	}

	for i := 0; i < 4; i++ {
		fmt.Println("set actor for", m.Name)
		_, err = client.SetActor(ctx, &heads2.SetActorIn{Actor: "Jitter"})
		if err != nil {
			return errors.Wrap(err, "set actor")
		}
		time.Sleep(20 * time.Second)
	}

	return nil
}

package lib

import (
	"context"
	"fmt"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"sync"
	"time"
)

func connectMember(m *client.Member, port int) (*grpc.ClientConn, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	target := fmt.Sprintf("%s:%d", m.Addr, port)
	conn, err := grpc.DialContext(
		ctx,
		target,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	return conn, errors.Wrap(err, "dial")
}

func ConnectAll(
	match string,
	port int,
	callback func(ctx context.Context, m *client.Member, conn *grpc.ClientConn) error,
) error {
	var wg sync.WaitGroup
	errCh := make(chan error)

	if err := AllHosts(match, func(m *client.Member) error {
		wg.Add(1)
		go func(m client.Member) {
			defer wg.Done()
			defer func() {
				fmt.Println(m.Name, "done")
			}()

			conn, err := connectMember(&m, port)
			if err != nil {
				errCh <- errors.Wrap(err, "connect member")
				return
			}

			ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
			defer cancel()
			errCh <- callback(ctx, &m, conn)
		}(*m)
		return nil
	}); err != nil {
		return errors.Wrap(err, "allhosts")
	}

	go func() {
		wg.Wait()
		close(errCh)
	}()

	for err := range errCh {
		if err != nil {
			return err
		}
	}

	return nil
}

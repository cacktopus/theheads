package heads_cli

import (
	"context"
	"fmt"
	heads2 "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"math"
	"time"
)

type PositionCmd struct{}

func (opt *PositionCmd) Execute(args []string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	conn, err := grpc.DialContext(
		ctx,
		host,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithBlock(),
	)
	if err != nil {
		return errors.Wrap(err, "dial")
	}
	fmt.Println(conn)

	client := heads2.NewHeadClient(conn)

	noError := func(err error) {
		if err != nil {
			panic(err)
		}
	}

	go func() {
		for range time.NewTicker(1000 * time.Millisecond).C {
			status, err := client.Status(context.Background(), &heads2.Empty{})
			noError(err)

			sensor, err := client.ReadMagnetSensor(context.Background(), &heads2.Empty{})
			noError(err)

			val := math.Abs(sensor.Bz) - math.Abs(sensor.By)
			fmt.Printf(
				"%d, %02.02f, %02.02f, %02.02f, %02.02f\n",
				status.Position,
				val,
				sensor.Bx,
				sensor.By,
				sensor.Bz,
			)
		}
	}()

	_, err = client.SetActor(context.Background(), &heads2.SetActorIn{
		Actor: "Seeker",
	})
	noError(err)

	for {
		var pos int
		_, err := fmt.Scan(&pos)
		noError(err)

		theta := 360.0 / numSteps * float64(pos)
		fmt.Println(theta)

		_, err = client.SetTarget(context.Background(), &heads2.SetTargetIn{
			Theta: theta,
		})
		noError(err)
	}
}

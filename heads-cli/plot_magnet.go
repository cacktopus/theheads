package heads_cli

import (
	"context"
	"fmt"
	heads2 "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/pkg/errors"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/plotutil"
	"gonum.org/v1/plot/vg"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"time"
)

const (
	host     = "localhost:8080"
	numSteps = 1036
)

type PlotMagnetCmd struct{}

func WaitFor(
	client heads2.HeadClient,
	tick time.Duration,
	callback func(state *heads2.HeadState) bool,
) error {
	for {
		status, err := client.Status(context.Background(), &heads2.Empty{})
		if err != nil {
			return errors.Wrap(err, "get status")
		}
		fmt.Println(status)
		if callback(status) {
			return nil
		}

		time.Sleep(tick)
	}

	return nil
}

func mod(i int, n int) int {
	m := i % n
	if m < 0 {
		return m + n
	}
	return m
}

func (opt *PlotMagnetCmd) Execute(args []string) error {
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

	if true {
		_, err = client.FindZero(context.Background(), &heads2.Empty{})
		if err != nil {
			return errors.Wrap(err, "find zero")
		}

		if err := WaitFor(client, 500*time.Millisecond, func(state *heads2.HeadState) bool {
			return state.Controller == "Idle"
		}); err != nil {
			return errors.Wrap(err, "wait for idle")
		}
	}

	{
		if _, err := client.SetActor(context.Background(), &heads2.SetActorIn{Actor: "Seeker"}); err != nil {
			return errors.Wrap(err, "set actor")
		}
	}

	const start = 200
	{
		if err := setPosition(client, 100*time.Millisecond, start); err != nil {
			return errors.Wrap(err, "set rotation")
		}
	}

	p := plot.New()

	p.Title.Text = "Magnet Sensor"
	p.X.Label.Text = "idx"
	p.Y.Label.Text = "B"

	var ptsX, ptsY, ptsZ plotter.XYs

	for i := start + 1; i < start+1+numSteps; i++ {
		pos := i % numSteps
		fmt.Println(i, pos)
		if err := setPosition(client, 0, pos); err != nil {
			return errors.Wrap(err, "set position")
		}

		time.Sleep(2 * time.Millisecond)

		sensor, err := client.ReadMagnetSensor(context.Background(), &heads2.Empty{})
		if err != nil {
			return errors.Wrap(err, "read magnet sensor")
		}
		fmt.Println(sensor)

		ptsX = append(ptsX, plotter.XY{
			X: float64(i),
			Y: sensor.Bx,
		})

		ptsY = append(ptsY, plotter.XY{
			X: float64(i),
			Y: sensor.By,
		})

		ptsZ = append(ptsZ, plotter.XY{
			X: float64(i),
			Y: sensor.Bz,
		})
	}

	if err := plotutil.AddLinePoints(p,
		"x", ptsX, "y", ptsY, "z", ptsZ,
	); err != nil {
		return errors.Wrap(err, "add line points")
	}

	if err := p.Save(40*vg.Inch, 4*vg.Inch, "B.svg"); err != nil {
		return errors.Wrap(err, "save")
	}

	return nil
}

func setPosition(client heads2.HeadClient, tick time.Duration, pos int) error {
	theta := (360.0 / numSteps) * float64(pos)

	if _, err := client.SetTarget(context.Background(), &heads2.SetTargetIn{
		Theta: theta,
	}); err != nil {
		return errors.Wrap(err, "set target")
	}

	if tick == 0 {
		return nil
	}

	if err := WaitFor(client, tick, func(state *heads2.HeadState) bool {
		cur := int(state.Position)
		cur = mod(cur, numSteps)
		return cur == pos
	}); err != nil {
		return errors.Wrap(err, "wait for pos")
	}
	return nil
}

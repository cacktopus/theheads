package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/gen/go/heads"
	"google.golang.org/grpc"
	"os"
	"time"
)

const (
	timeout = 30 * time.Second
)

type clients struct {
	head   heads.HeadClient
	voices heads.VoicesClient
}

type objects struct {
	clients clients
	host    string
}

func call(obj *objects, callback func(context.Context, *objects)) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	callback(ctx, obj)
}

func main() {
	host := os.Args[1]
	url := fmt.Sprintf("%s:8080", host)

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	headConn, err := grpc.DialContext(ctx, url, grpc.WithInsecure())
	handleErr(err)

	headClient := heads.NewHeadClient(headConn)
	voicesClient := heads.NewVoicesClient(headConn)

	obj := &objects{
		clients: clients{
			head:   headClient,
			voices: voicesClient,
		},
		host: host,
	}

	call(obj, checkStepper)
	call(obj, checkHallEffectSensor)
	call(obj, checkCamera)
	call(obj, checkSound)

	handleErr(err)
}

func checkStepper(ctx context.Context, obj *objects) {
	status, err := obj.clients.head.Status(ctx, &heads.Empty{})
	handleErr(err)

	marshal, err := json.Marshal(status)
	handleErr(err)

	fmt.Println(string(marshal))

	_, err = obj.clients.head.Rotation(ctx, &heads.RotationIn{
		Theta: 180 + status.Rotation,
	})
	handleErr(err)
}

func checkSound(ctx context.Context, obj *objects) {
	_, err := obj.clients.voices.SetVolume(ctx, &heads.SetVolumeIn{VolDb: -30})
	handleErr(err)

	fmt.Println("playing sound")
	_, err = obj.clients.voices.Random(ctx, &heads.Empty{})
	handleErr(err)

	_, err = obj.clients.voices.SetVolume(ctx, &heads.SetVolumeIn{VolDb: -100})
	handleErr(err)

	fmt.Println("did you head a sound?")
	fmt.Println("press enter when done")
	fmt.Scanln()
}

func checkCamera(ctx context.Context, obj *objects) {
	url := fmt.Sprintf("http://%s:5000", obj.host)
	fmt.Println("check for camera feed:", url)
	fmt.Println("press enter when done")
	fmt.Scanln()
}

func checkHallEffectSensor(ctx context.Context, obj *objects) {
	fmt.Println("checking hall effect sensor")
	fmt.Println("wave magnet over sensor")
	fmt.Println("press enter when done")
	fmt.Println("press enter to start")
	fmt.Scanln()

	done := make(chan bool)
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	go func() {
		fmt.Scanln()
		done <- true
	}()

	for {
		select {
		case <-done:
			return
		case <-ticker.C:
			func() {
				ctx, cancel := context.WithTimeout(ctx, time.Second)
				defer cancel()
				result, err := obj.clients.head.ReadHallEffectSensor(ctx, &heads.Empty{})
				if err != nil {
					handleErr(err)
				}
				fmt.Println("sensor active:", result.Active)
			}()
		}
	}
}

func handleErr(err error) {
	if err != nil {
		panic(err)
	}
}

package diag

import (
	"context"
	"encoding/json"
	"fmt"
	heads2 "github.com/cacktopus/theheads/gen/go/heads"
	"google.golang.org/grpc"
	"strings"
	"time"
)

const (
	timeout = 30 * time.Second
)

type clients struct {
	head   heads2.HeadClient
	voices heads2.VoicesClient
	camera *grpc.ClientConn
}

type objects struct {
	clients   clients
	host      string
	cameraURL string
}

func call(obj *objects, callback func(context.Context, *objects)) {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	callback(ctx, obj)
}

func Run(host string) {
	headConn := connect(fmt.Sprintf("%s:8080", host))
	cameraURL := fmt.Sprintf("%s:5000", host)
	cameraConn := connect(cameraURL)

	obj := &objects{
		clients: clients{
			head:   heads2.NewHeadClient(headConn),
			voices: heads2.NewVoicesClient(headConn),
			camera: cameraConn,
		},
		host:      host,
		cameraURL: cameraURL,
	}

	call(obj, checkStepper)
	call(obj, checkFindZero)
	//call(obj, checkHallEffectSensor)
	call(obj, checkCamera)
	call(obj, checkSound)
}

func connect(url string) *grpc.ClientConn {
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	headConn, err := grpc.DialContext(ctx, url, grpc.WithInsecure())
	handleErr(err)
	return headConn
}

func checkFindZero(ctx context.Context, obj *objects) {
	fmt.Println("checking zero finding")

	_, err := obj.clients.head.FindZero(ctx, &heads2.Empty{})
	handleErr(err)

	fmt.Scanln()
}

func checkStepper(ctx context.Context, obj *objects) {
	fmt.Println("checking stepper")

	status, err := obj.clients.head.Status(ctx, &heads2.Empty{})
	handleErr(err)

	marshal, err := json.Marshal(status)
	handleErr(err)

	fmt.Println(string(marshal))

	_, err = obj.clients.head.SetActor(ctx, &heads2.SetActorIn{
		Actor: "Seeker",
	})
	handleErr(err)

	_, err = obj.clients.head.SetTarget(ctx, &heads2.SetTargetIn{
		Theta: 180 + status.Rotation,
	})
	handleErr(err)

	fmt.Scanln()
}

func checkSound(ctx context.Context, obj *objects) {
	_, err := obj.clients.voices.SetVolume(ctx, &heads2.SetVolumeIn{VolDb: -30})
	handleErr(err)

	fmt.Println("playing sound")
	_, err = obj.clients.voices.Random(ctx, &heads2.Empty{})
	handleErr(err)

	_, err = obj.clients.voices.SetVolume(ctx, &heads2.SetVolumeIn{VolDb: -100})
	handleErr(err)

	fmt.Println("did you head a sound?")
	fmt.Println("press enter when done")
	fmt.Scanln()
}

func checkCamera(ctx context.Context, obj *objects) {
	events, err := heads2.NewEventsClient(obj.clients.camera).Stream(ctx, &heads2.Empty{})
	handleErr(err)

	go func() {
		for {
			msg, err := events.Recv()

			switch {
			case err == nil:
				// pass
			case strings.Contains(err.Error(), "context canceled"):
				return
			default:
				handleErr(err)
			}

			switch msg.Type {
			case "motion-detected":
				fmt.Println(msg.Type, msg.Data)
			}
		}
	}()

	fmt.Printf("check for camera feed: http://%s\n", obj.cameraURL)
	fmt.Println("press enter when done")
	fmt.Scanln()
	events.Context().Done()
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
				result, err := obj.clients.head.ReadHallEffectSensor(ctx, &heads2.Empty{})
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

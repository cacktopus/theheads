package client

import (
	"fmt"
	"github.com/hashicorp/serf/client"
	"github.com/mitchellh/mapstructure"
	"github.com/pkg/errors"
	"os/exec"
	"time"
)

type EventShell struct {
	Event string
}

type Query struct {
	Event   string
	ID      uint64
	LTime   uint64
	Name    string
	Payload []byte
}

func Run(errCh chan error) {
	for {
		fmt.Println("connecting to serf")
		err := connectAndListenForEvents()
		if err != nil {
			fmt.Println("serf error:", err)
		}
		time.Sleep(time.Second)
	}
}

func connectAndListenForEvents() error {
	serfClient, err := client.NewRPCClient("127.0.0.1:7373")
	if err != nil {
		return errors.Wrap(err, "connect")
	}

	members, err := serfClient.Members()
	if err != nil {
		return errors.Wrap(err, "members")
	}

	for _, member := range members {
		fmt.Println(member.Name, member.Status, member.Addr)
	}

	ch := make(chan map[string]interface{})

	fmt.Println("stream ...")

	_, err = serfClient.Stream("", ch)
	if err != nil {
		return errors.Wrap(err, "stream")
	}

	fmt.Println("listening for events")
	for e := range ch {
		fmt.Println(e)
		shell := &EventShell{}
		err := mapstructure.Decode(e, shell)
		if err != nil {
			return errors.Wrap(err, "decode")
		}

		fmt.Println(shell)

		switch shell.Event {
		case "query":
			query := &Query{}
			err := mapstructure.Decode(e, query)
			if err != nil {
				return errors.Wrap(err, "decode")
			}

			response := handleQuery(query)
			if response != nil {
				err = serfClient.Respond(query.ID, response)
				if err != nil {
					return errors.Wrap(err, "respond")
				}
			}
		}
	}

	return nil
}

func handleQuery(query *Query) []byte {
	switch query.Name {
	case "reboot":
		fmt.Println("reboot request")
		go scheduleReboot(5 * time.Second)
		return []byte("reboot scheduled")

	case "halt":
		fmt.Println("halt request")
		go scheduleHalt(5 * time.Second)
		return []byte("halt scheduled")

	case "time":
		fmt.Println("time request")
		return []byte(time.Now().String())
	}

	return nil
}

func scheduleReboot(delay time.Duration) {
	time.Sleep(delay)
	cmd := exec.Command("sudo", "-n", "/sbin/shutdown", "-r", "now")
	output, err := cmd.CombinedOutput()
	fmt.Println(err)
	fmt.Println(string(output))
}

func scheduleHalt(delay time.Duration) {
	time.Sleep(delay)
	cmd := exec.Command("sudo", "-n", "/sbin/shutdown", "-h", "now")
	output, err := cmd.CombinedOutput()
	fmt.Println(err)
	fmt.Println(string(output))
}

package client

import (
	"github.com/hashicorp/serf/client"
	"github.com/mitchellh/mapstructure"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"os"
	"os/exec"
	"regexp"
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

var hostname string

func init() {
	var err error
	hostname, err = os.Hostname()
	if err != nil {
		panic("unable to determine hostname")
	}
}

func Run(logger *zap.Logger, errCh chan error) {
	for {
		logger.Debug("connecting to serf")
		err := connectAndListenForEvents(logger)
		if err != nil {
			logger.Error("serf error", zap.Error(err))
		}
		time.Sleep(5 * time.Second)
	}
}

func connectAndListenForEvents(logger *zap.Logger) error {
	serfClient, err := client.NewRPCClient("127.0.0.1:7373")
	if err != nil {
		return errors.Wrap(err, "connect")
	}

	members, err := serfClient.Members()
	if err != nil {
		return errors.Wrap(err, "members")
	}

	for _, member := range members {
		logger.Debug(
			"member",
			zap.String("name", member.Name),
			zap.String("status", member.Status),
			zap.String("addr", member.Addr.String()),
		)
	}

	ch := make(chan map[string]interface{})

	logger.Debug("stream")

	_, err = serfClient.Stream("", ch)
	if err != nil {
		return errors.Wrap(err, "stream")
	}

	logger.Debug("listening for events")
	for e := range ch {
		shell := &EventShell{}
		err := mapstructure.Decode(e, shell)
		if err != nil {
			return errors.Wrap(err, "decode")
		}

		logger.Debug("shell", zap.String("event", shell.Event))

		switch shell.Event {
		case "query":
			query := &Query{}
			err := mapstructure.Decode(e, query)
			if err != nil {
				return errors.Wrap(err, "decode")
			}

			response := handleQuery(logger, query)
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

func handleQuery(logger *zap.Logger, query *Query) []byte {
	switch query.Name {
	case "reboot":
		logger.Info("reboot request")
		if ok, msg := matchedHost(query.Payload); !ok {
			return msg
		}
		go scheduleReboot(logger, 5*time.Second)
		return []byte("reboot scheduled")

	case "halt":
		if ok, msg := matchedHost(query.Payload); !ok {
			return msg
		}
		logger.Info("halt request")
		go scheduleHalt(logger, 5*time.Second)
		return []byte("halt scheduled")

	case "time":
		logger.Info("time request")
		return []byte(time.Now().String())
	}

	return nil
}

func matchedHost(payload []byte) (bool, []byte) {
	rx, err := regexp.Compile(string(payload))
	if err != nil {
		return false, []byte("invalid host regex")
	}

	if rx.Match([]byte(hostname)) {
		return true, nil
	}

	return false, []byte("host not matched")
}

func scheduleReboot(logger *zap.Logger, delay time.Duration) {
	time.Sleep(delay)
	cmd := exec.Command("sudo", "-n", "/sbin/shutdown", "-r", "now")
	output, err := cmd.CombinedOutput()
	logger.Error("/sbin/shutdown error", zap.String("output", string(output)), zap.Error(err))
}

func scheduleHalt(logger *zap.Logger, delay time.Duration) {
	time.Sleep(delay)
	cmd := exec.Command("sudo", "-n", "/sbin/shutdown", "-h", "now")
	output, err := cmd.CombinedOutput()
	logger.Error("/sbin/shutdown error", zap.String("output", string(output)), zap.Error(err))
}

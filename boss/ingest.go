package boss

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/grandcat/zeroconf"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"strings"
	"sync"
	time "time"
)

func init() {
	prometheus.MustRegister(eventReceived)
}

var eventReceived = prometheus.NewCounterVec(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "boss",
	Name:      "event_received",
}, []string{
	"type",
	"source",
})

func stream(logger *zap.Logger, discovery discovery.Discovery, serviceName string, callback func(addr string)) {
	allAddr := map[string]bool{}
	var lock sync.Mutex

	ctx := context.Background()

	discovery.Discover(logger, ctx, fmt.Sprintf("_%s._tcp", serviceName),
		func(entry *zeroconf.ServiceEntry) {
			host := strings.TrimRight(entry.HostName, ".")
			addr := fmt.Sprintf("%s:%d", host, entry.Port)
			logrus.
				WithField("instance", entry.Instance).
				WithField("addr", addr).
				WithField("service", serviceName).
				Info("found service")

			lock.Lock()
			defer lock.Unlock()
			_, found := allAddr[addr]
			if !found {
				go callback(addr)
			}
			allAddr[addr] = true
		},
	)
}

func streamHead(b *broker.Broker, addr string) {
	//TODO: DRY with streamCamera

	for {
		err := func() error {
			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			if err != nil {
				return err
			}
			defer conn.Close()

			client := gen.NewHeadClient(conn)
			events, err := client.Events(context.Background(), &gen.Empty{})
			if err != nil {
				return err
			}

			for {
				msg, err := events.Recv()

				if err != nil {
					return err
				}

				err = publish(b, msg.Type, msg.Data)
				if err != nil {
					panic(err)
				}
			}
		}()

		logrus.WithError(err).Warn("streaming error") // TODO: more fields
		time.Sleep(5 * time.Second)                   // TODO: exponential backoff
		logrus.Info("retrying stream")                // TODO: more fields
	}
}

func streamCamera(b *broker.Broker, addr string) {
	for {
		err := func() error {
			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			if err != nil {
				return err
			}
			defer conn.Close()

			client := gen.NewCameraClient(conn)
			events, err := client.Events(context.Background(), &gen.Empty{})
			if err != nil {
				return err
			}

			for {
				msg, err := events.Recv()

				if err != nil {
					return err
				}

				err = publish(b, msg.Type, msg.Data)
				if err != nil {
					panic(err)
				}
			}
		}()

		logrus.WithError(err).Warn("streaming error") // TODO: more fields
		time.Sleep(5 * time.Second)                   // TODO: exponential backoff
		logrus.Info("retrying stream")                // TODO: more fields
	}
}

func publish(b *broker.Broker, typ string, data []byte) error {
	event := schema.HeadEvent{Type: typ}
	err := json.Unmarshal(data, &event.Data)
	if err != nil {
		return err
	}

	switch event.Type {
	case "head-positioned":
		msg := broker.HeadPositioned{}

		err = json.Unmarshal(event.Data, &msg)
		if err != nil {
			return err
		}
		eventReceived.WithLabelValues(event.Type, msg.HeadName).Inc()
		b.Publish(msg)

	case "motion-detected":
		msg := broker.MotionDetected{}
		err = json.Unmarshal(event.Data, &msg)
		if err != nil {
			return err
		}
		eventReceived.WithLabelValues(event.Type, msg.CameraName).Inc()
		b.Publish(msg)

	case "active":
		msg := schema.Active{}
		err = json.Unmarshal(event.Data, &msg)
		if err != nil {
			return err
		}
		source := fmt.Sprintf("%s-%s", msg.Component, msg.Name_)
		eventReceived.WithLabelValues(event.Type, source).Inc()
		b.Publish(msg)
	}

	return nil
}

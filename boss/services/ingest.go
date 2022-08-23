package services

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"sync"
	"time"
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

type EventReceiver interface {
	Recv() (*gen.Event, error)
}

func discoverAsync(
	logger *zap.Logger,
	discover discovery.Discovery,
	serviceName string,
	serviceCh chan *discovery.Entry,
) {
	for {
		services, err := discover.Discover(logger)
		if err != nil {
			logger.Info("error streaming", zap.Error(err))
		} else {
			for _, service := range services {
				if service.Service == serviceName {
					serviceCh <- service
				}
			}
		}
		time.Sleep(5 * time.Second)
	}
}

type EventStreamer struct {
	logger   *zap.Logger
	discover discovery.Discovery
	broker   *broker.Broker
}

func NewEventStreamer(
	logger *zap.Logger,
	discover discovery.Discovery,
	broker *broker.Broker,
) *EventStreamer {
	return &EventStreamer{
		logger:   logger,
		discover: discover,
		broker:   broker,
	}
}

func (es *EventStreamer) Stream(serviceName string) {
	allAddr := map[string]bool{}
	var lock sync.Mutex

	logger := es.logger.With(zap.String("service", serviceName))

	services := make(chan *discovery.Entry)
	go discoverAsync(logger, es.discover, serviceName, services)

	for entry := range services {
		var found bool
		func() {
			lock.Lock()
			defer lock.Unlock()
			_, found = allAddr[entry.Addr]
			allAddr[entry.Addr] = true
		}()

		if !found {
			go es.streamEvents(
				logger.With(
					zap.String("instance", entry.Instance),
					zap.String("addr", entry.Addr),
				),
				entry.Addr,
			)
		}
	}
}

func (es *EventStreamer) streamEvents(logger *zap.Logger, addr string) {
	logger.Info("streaming events")
	for {
		err := func() error {
			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			if err != nil {
				return err
			}
			defer conn.Close()

			events, err := gen.NewEventsClient(conn).Stream(context.Background(), &gen.Empty{})
			if err != nil {
				return err
			}

			for {
				msg, err := events.Recv()

				if err != nil {
					return err
				}

				err = es.publish(msg.Type, []byte(msg.Data))
				if err != nil {
					panic(err)
				}
			}
		}()

		logger.Error("streaming error", zap.Error(err))
		time.Sleep(5 * time.Second) // TODO: exponential backoff
		logger.Info("retrying stream")
	}
}

func (es *EventStreamer) publish(typ string, data []byte) error {
	event := schema.Event{Type: typ}
	err := json.Unmarshal(data, &event.Data)
	if err != nil {
		return err
	}

	switch event.Type {
	case "head-positioned":
		msg := &schema.HeadPositioned{}

		err = json.Unmarshal(event.Data, msg)
		if err != nil {
			return err
		}
		eventReceived.WithLabelValues(event.Type, msg.HeadName).Inc()
		es.broker.Publish(msg)

	case "motion-detected":
		msg := &schema.MotionDetected{}
		err = json.Unmarshal(event.Data, msg)
		if err != nil {
			return err
		}
		eventReceived.WithLabelValues(event.Type, msg.CameraName).Inc()
		es.broker.Publish(msg)

	case "brightness":
		msg := &schema.Brightness{}
		err = json.Unmarshal(event.Data, msg)
		if err != nil {
			return err
		}
		eventReceived.WithLabelValues(event.Type, msg.CameraName).Inc()
		es.broker.Publish(msg)

	case "active":
		msg := &schema.Active{}
		err = json.Unmarshal(event.Data, msg)
		if err != nil {
			return err
		}
		source := fmt.Sprintf("%s-%s", msg.Component, msg.HeadName)
		eventReceived.WithLabelValues(event.Type, source).Inc()
		es.broker.Publish(msg)

	case "face-detected":
		msg := &schema.FaceDetected{}
		err = json.Unmarshal(event.Data, msg)
		if err != nil {
			return err
		}
		source := fmt.Sprintf("%s", msg.CameraName)
		eventReceived.WithLabelValues(event.Type, source).Inc()
		es.broker.Publish(msg)
	}

	return nil
}

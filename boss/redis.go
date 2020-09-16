package main

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/gomodule/redigo/redis"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/sirupsen/logrus"
	"time"
)

var redisEventReceived = prometheus.NewCounterVec(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "boss",
	Name:      "redis_event_received",
}, []string{
	"type",
	"source",
})

func retryFunc(delay time.Duration, description string, f func() error) {
	for {
		err := f()
		if err == nil {
			logrus.WithField("operation", description).Info("Retrying")
			break
		} else {
			logrus.WithField("operation", description).WithError(err).Info("Retrying")
			time.Sleep(delay)
		}
	}
}

func runRedis(msgBroker *broker.Broker, redisServer string) {
	retryFunc(time.Second, "redis subscribe loop: "+redisServer, func() error {
		return runRedisInternal(msgBroker, redisServer)
	})
}

func runRedisInternal(msgBroker *broker.Broker, redisServer string) error {
	// https://godoc.org/github.com/garyburd/redigo/redis#example-PubSubConn
	// TODO: use callback approach to separate concerns

	logrus.WithField("server", redisServer).Info("Connecting to redis")
	redisClient, err := redis.Dial("tcp", redisServer)
	if err != nil {
		logrus.WithError(err).Error("Error connecting to redis")
		return err
	}
	logrus.WithField("server", redisServer).Info("Connected to redis")

	psc := redis.PubSubConn{Conn: redisClient}

	if err := psc.Subscribe("the-heads-events"); err != nil {
		panic(err)
	}

	done := make(chan error, 1)

	go func() {
		for {
			switch v := psc.Receive().(type) {
			case redis.Message:
				event := broker.HeadEvent{}
				err := json.Unmarshal(v.Data, &event)

				if err != nil {
					done <- err
					return
				}

				switch event.Type {
				case "head-positioned":
					msg := broker.HeadPositioned{}

					err = json.Unmarshal(event.Data, &msg)
					if err != nil {
						done <- err
						return
					}
					redisEventReceived.WithLabelValues(event.Type, msg.HeadName).Inc()
					msgBroker.Publish(msg)
				case "motion-detected":
					msg := broker.MotionDetected{}
					err = json.Unmarshal(event.Data, &msg)
					if err != nil {
						done <- err
						return
					}
					redisEventReceived.WithLabelValues(event.Type, msg.CameraName).Inc()
					msgBroker.Publish(msg)

				case "active":
					msg := broker.Active{}
					err = json.Unmarshal(event.Data, &msg)
					if err != nil {
						done <- err
						return
					}
					source := fmt.Sprintf("%s-%s", msg.Component, msg.Name_)
					redisEventReceived.WithLabelValues(event.Type, source).Inc()
					msgBroker.Publish(msg)
				}

			case redis.Subscription:
				if v.Count == 0 {
					done <- nil
					return
				}
			case error:
				err = v
				logrus.WithError(err).Error("redis error")
				done <- err
				return
			}
		}
	}()

	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

loop:
	for err == nil {
		select {
		case <-ticker.C:
			logrus.Debugln("ping", redisServer)
			if err = psc.Ping(""); err != nil {
				break loop
			}
			logrus.Debugln("pong", redisServer)
		case err := <-done:
			return err
		}
	}

	psc.Unsubscribe()

	return <-done
}

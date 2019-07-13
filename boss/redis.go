package main

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/gomodule/redigo/redis"
	log "github.com/sirupsen/logrus"
	"time"
)

func retryFunc(delay time.Duration, description string, f func() error) {
	for {
		err := f()
		if err == nil {
			log.WithField("operation", description).Println("Retrying")
			break
		} else {
			log.WithField("operation", description).WithError(err).Println("Retrying")
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

	log.Println("Connecting to redis @ ", redisServer)
	redisClient, err := redis.Dial("tcp", redisServer)
	if err != nil {
		log.WithError(err).Error("Error connecting to redis")
		return err
	}
	log.Println("Connected to redis @ ", redisServer)

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
					msgBroker.Publish(msg)
				case "motion-detected":
					msg := broker.MotionDetected{}
					err = json.Unmarshal(event.Data, &msg)
					if err != nil {
						done <- err
						return
					}
					msgBroker.Publish(msg)
				}

			case redis.Subscription:
				fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
			case error:
				err = v
				log.WithError(err).Println("redis error")
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
			log.Println("ping", redisServer)
			if err = psc.Ping(""); err != nil {
				break loop
			}
			log.Println("pong", redisServer)
		case err := <-done:
			return err
		}
	}

	psc.Unsubscribe()

	return <-done
}

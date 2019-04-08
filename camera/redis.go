package main

import (
	"errors"
	"github.com/gomodule/redigo/redis"
	log "github.com/sirupsen/logrus"
	"time"
)

func retry(delay time.Duration, description string, f func() error) {
	for {
		err := f()
		if err == nil {
			break
		} else {
			log.WithField("operation", description).Println("Retrying")
			time.Sleep(delay)
		}
	}
}

type RedisPublisher struct {
	redisServer string
	queue       chan []byte
	quit        chan bool
}

func (p *RedisPublisher) Send(msg []byte) error {
	select {
	case p.queue <- msg:
		return nil
	default:
		return errors.New("Queue full")
	}
}

func (p *RedisPublisher) Stop() {
	p.quit <- true
}

func (p *RedisPublisher) publishLoop(redisClient redis.Conn) error {
	for {
		select {
		case payload := <-p.queue:
			// TODO: counter
			_, err := redisClient.Do("PUBLISH", "the-heads-events", payload)
			if err != nil {
				log.WithError(err).Error("Error publishing to redis:", err)
				p.drainQueue()
				return err
			}
		case <-p.quit:
			redisClient.Close()
			p.drainQueue()
			return nil
		}
	}
}

func (p *RedisPublisher) drainQueue() {
	for {
		select {
		case <-p.queue:
		default:
			return
		}
	}
}

func (p *RedisPublisher) mainLoop() error {
	log.Println("Connecting to redis @ ", p.redisServer)
	redisClient, err := redis.Dial("tcp", p.redisServer)
	if err != nil {
		log.WithError(err).Error("Error connecting to redis")
		return err
	}
	log.Println("Connected to redis @ ", p.redisServer)
	return p.publishLoop(redisClient)
}

func (p *RedisPublisher) Run() {
	retry(
		time.Second,
		"redis publisher mainLoop",
		p.mainLoop,
	)
}

func NewRedisPublisher(redisServer string) *RedisPublisher {
	r := &RedisPublisher{
		redisServer: redisServer,
		queue:       make(chan []byte, 1024),
		quit:        make(chan bool),
	}
	return r
}

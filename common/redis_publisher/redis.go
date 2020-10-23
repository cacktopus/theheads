package redis_publisher

import (
	"encoding/json"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/gomodule/redigo/redis"
	"github.com/pkg/errors"
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
	redisServer  string
	instanceName string
	queue        chan []byte
	quit         chan bool
}

func (p *RedisPublisher) SendMsg(msg interface{}) error {
	payload, err := json.Marshal(msg)
	if err != nil {
		return errors.Wrap(err, "marshal json")
	}
	err = p.Send(payload)
	return errors.Wrap(err, "send")
}

func (p *RedisPublisher) Send(msg []byte) error {
	select {
	case p.queue <- msg:
		return nil
	default:
		return errors.New("queue full")
	}
}

func (p *RedisPublisher) Stop() {
	p.quit <- true
}

func (p *RedisPublisher) publishLoop(redisClient redis.Conn) error {
	t := time.NewTicker(15 * time.Second)

	pingMsg, err := json.Marshal(schema.Ping{
		schema.MessageHeader{
			Type: "ping",
		},
		schema.PingData{
			Name: p.instanceName,
		},
	})
	if err != nil {
		panic(err)
	}

	for {
		var msg []byte
		var err error

		select {
		case payload := <-p.queue:
			msg = payload
		case <-t.C:
			msg = pingMsg
		case <-p.quit:
			redisClient.Close()
			p.drainQueue()
			return nil
		}

		if err != nil {
			return err
		}

		// TODO: counter
		_, err = redisClient.Do("PUBLISH", "the-heads-events", msg)
		if err != nil {
			log.WithError(err).Error("Error publishing to redis:", err)
			p.drainQueue()
			return err
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
	log.Println("Connecting to redis:", p.redisServer)
	redisClient, err := redis.Dial("tcp", p.redisServer)
	if err != nil {
		log.WithError(err).Error("Error connecting to redis")
		return err
	}
	log.Println("Connected to redis:", p.redisServer)
	return p.publishLoop(redisClient)
}

func (p *RedisPublisher) Run() {
	retry(
		time.Second,
		"redis publisher mainLoop",
		p.mainLoop,
	)
}

func NewRedisPublisher(redisServer string, instanceName string) *RedisPublisher {
	r := &RedisPublisher{
		redisServer:  redisServer,
		queue:        make(chan []byte, 1024),
		quit:         make(chan bool),
		instanceName: instanceName,
	}
	return r
}

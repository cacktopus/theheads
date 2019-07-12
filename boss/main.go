package main

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
	"net/http"
)

var upgrader = websocket.Upgrader{}

type HeadEvent struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type MotionDetected struct {
	CameraName string  `json:"cameraName"`
	Position   float64 `json:"position"`
}

func (MotionDetected) Name() string {
	return "motion-detected"
}

type HeadPositioned struct {
	HeadName     string  `json:"headName"`
	StepPosition float32 `json:"stepPosition"`
	Rotation     float32 `json:"rotation"`
}

func (HeadPositioned) Name() string {
	return "head-positioned"
}

func runRedis(broker *Broker, redisServer string) {
	log.Println("Connecting to redis @ ", redisServer)
	redisClient, err := redis.Dial("tcp", redisServer)
	if err != nil {
		log.WithError(err).Error("Error connecting to redis")
		panic(err)
	}
	log.Println("Connected to redis @ ", redisServer)

	psc := redis.PubSubConn{Conn: redisClient}

	if err := psc.Subscribe("the-heads-events"); err != nil {
		panic(err)
	}

	for {
		switch v := psc.Receive().(type) {
		case redis.Message:
			event := HeadEvent{}
			err := json.Unmarshal(v.Data, &event)
			if err != nil {
				panic(err)
			}
			switch event.Type {
			case "head-positioned":
				msg := HeadPositioned{}
				err = json.Unmarshal(event.Data, &msg)
				if err != nil {
					panic(err)
				}
				broker.Publish(msg)
			case "motion-detected":
				msg := MotionDetected{}
				err = json.Unmarshal(event.Data, &msg)
				if err != nil {
					panic(err)
				}
				broker.Publish(msg)
			}
		case redis.Subscription:
			fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
		case error:
			panic(v)
		}
	}
}

func main() {
	broker := NewBroker()
	go broker.Start()

	var theScene scene.Scene
	err := json.Unmarshal([]byte(scene.Json), &theScene)
	if err != nil {
		panic(err)
	}
	theScene.Denormalize()

	// TODO: need this due to a bunch of drift in theScene due to denormalization
	var jsonScene interface{}
	err = json.Unmarshal([]byte(scene.Json), &jsonScene)
	if err != nil {
		panic(err)
	}

	redisServers := []string{"127.0.0.1:6379"}

	for _, redis := range redisServers {
		go runRedis(broker, redis)
	}

	go ManageFocalPoints(theScene, broker)

	addr := ":7071"

	r := gin.New()
	r.Use(
		gin.LoggerWithWriter(gin.DefaultWriter, "/metrics", "/health"),
		gin.Recovery(),
	)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.StaticFile("/", "./templates/boss.html")

	r.GET("/installation/:installation/scene.json", func(c *gin.Context) {
		c.JSON(200, jsonScene)
	})

	r.Static("/build", "./boss-ui/build")
	r.Static("/static", "boss-ui/build/static")

	r.GET("/ws", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			fmt.Println("Failed to set websocket upgrade: %+v", err)
			return
		}
		manageWebsocket(conn, broker)
	}))

	go func() {
		r.Run(addr)
	}()

	select {}
}

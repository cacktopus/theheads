package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gomodule/redigo/redis"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
)

func runRedis(redisServer string) {
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
			log.Println("message:", v.Channel, string(v.Data))
		case redis.Subscription:
			fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
		case error:
			panic(v)
		}
	}
}

func main() {
	redisServers := []string{"10.0.0.42:6379", "10.0.0.43:6379"}

	for _, redis := range redisServers {
		go runRedis(redis)
	}

	addr := ":8081"

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

	go func() {
		r.Run(addr)
	}()

	select {}
}

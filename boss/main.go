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
			//log.Println("message:", v.Channel, string(v.Data))
		case redis.Subscription:
			fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
		case error:
			panic(v)
		}
	}
}

func main() {
	redisServers := []string{"127.0.0.1:6379"}

	for _, redis := range redisServers {
		go runRedis(redis)
	}

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

	//web.get("/build/{filename}", frontend_handler("boss-ui/build")),
	//web.get("/build/json/{filename}", frontend_handler("boss-ui/build/json")),
	//web.get("/build/media/{filename}", frontend_handler("boss-ui/build/media")),
	//web.get("/build/js/{filename}", frontend_handler("boss-ui/build/js")),
	//web.get("/static/js/{filename}", frontend_handler("boss-ui/build/static/js")),
	//web.get("/static/css/{filename}", frontend_handler("boss-ui/build/static/css")),

	r.Static("/build", "./boss-ui/build")
	//r.Static("/build/json", "./boss-ui/build")
	r.Static("/static", "boss-ui/build/static")

	go func() {
		r.Run(addr)
	}()

	select {}
}

package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/cacktopus/heads/boss/config"
	"github.com/cacktopus/heads/boss/scene"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func main() {
	broker := broker.NewBroker()
	go broker.Start()

	consulClient := config.NewClient()
	theScene, err := scene.BuildInstallation(consulClient)
	if err != nil {
		panic(err)
	}

	grid := NewGrid(
		-10, -10, 10, 10,
		400, 400,
		theScene,
		broker,
	)
	go grid.Start()

	redisServers, err := config.AllServiceURLs(consulClient, "redis", "", "", "")
	if err != nil {
		panic(err)
	}

	if len(redisServers) == 0 {
		panic("Need at least one redis server, for now")
	}

	for _, redis := range redisServers {
		go runRedis(broker, redis)
	}

	go ManageFocalPoints(theScene, broker, grid)

	addr := ":8081"

	r := gin.New()
	r.Use(
		gin.LoggerWithWriter(gin.DefaultWriter, "/metrics", "/health"),
		gin.Recovery(),
	)
	pprof.Register(r)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.StaticFile("/", "./templates/boss.html")

	r.GET("/installation/:installation/scene.json", func(c *gin.Context) {
		c.JSON(200, theScene)
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

	headManager := NewHeadManager()

	FollowEvade(grid, theScene, headManager)
}

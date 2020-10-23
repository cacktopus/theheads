package main

import (
	"fmt"
	"github.com/cacktopus/theheads/boss/broker"
	"github.com/cacktopus/theheads/boss/config"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"github.com/vrischmann/envconfig"
	"math/rand"
	"net/http"
	"os"
	"time"
)

type Cfg struct {
	ConsulAddr string `envconfig:"default=127.0.0.1:8500"`
}

var upgrader = websocket.Upgrader{}

type JournaldFormatter struct {
}

var formatter = logrus.JSONFormatter{}

func (f *JournaldFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	result, err := formatter.Format(entry)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal fields to JSON, %s", err.Error())
	}

	var level string
	switch entry.Level {
	case logrus.ErrorLevel:
		level = "<3>"
	case logrus.WarnLevel:
		level = "<4>"
	case logrus.InfoLevel:
		level = "<5>"
	case logrus.DebugLevel:
		level = "<7>"
	default:
		level = "<1>"
	}

	return append([]byte(level), result...), nil
}

func main() {
	cfg := &Cfg{}

	err := envconfig.Init(cfg)
	if err != nil {
		panic(err)
	}

	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(new(JournaldFormatter))

	rand.Seed(time.Now().UTC().UnixNano())

	go watchdog.Watch()

	broker := broker.NewBroker()
	go broker.Start()

	consulClient := config.NewClient(cfg.ConsulAddr)
	theScene, err := scene.BuildInstallation(consulClient)
	if err != nil {
		panic(err)
	}

	grid := grid.NewGrid(
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

	r.StaticFile("/", "./boss.html")

	r.GET("/installation/:installation/scene.json", func(c *gin.Context) {
		c.JSON(200, theScene)
	})

	r.Static("/build", "./boss-ui/build")
	r.Static("/static", "./boss-ui/build/static")

	r.GET("/ws", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logrus.WithError(err).Error("Failed to set websocket upgrade")
			return
		}
		manageWebsocket(conn, broker)
	}))

	r.GET("/restart", func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		logrus.WithField("origin", origin).Info("restart")

		c.Header("Access-Control-Allow-Origin", "*")

		service := c.Query("service")
		if service == "boss" {
			c.Status(200)
			go func() {
				time.Sleep(500 * time.Millisecond)
				os.Exit(0)
			}()
		} else {
			c.Status(http.StatusBadRequest)
		}
	})

	go func() {
		r.Run(addr)
	}()

	headManager := head_manager.NewHeadManager(cfg.ConsulAddr)

	texts := LoadTexts(consulClient)

	dj := &DJ{
		grid:        grid,
		scene:       theScene,
		headManager: headManager,
		texts:       texts,
	}

	dj.RunScenes()
}

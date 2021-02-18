package boss

import (
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"math/rand"
	"net/http"
	"os"
	"time"
)

type Cfg struct {
	ScenePath string
}

var upgrader = websocket.Upgrader{}

func Run(env *Cfg, discovery discovery.Discovery) {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	logrus.SetLevel(logrus.DebugLevel)
	logrus.SetFormatter(&logrus.JSONFormatter{})

	rand.Seed(time.Now().UTC().UnixNano())

	go watchdog.Watch()

	broker := broker.NewBroker()
	go broker.Start()

	theScene, err := scene.BuildInstallation(env.ScenePath)
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

	stream(logger, discovery, "head", func(addr string) {
		streamHead(broker, addr)
	})
	stream(logger, discovery, "camera", func(addr string) {
		streamCamera(broker, addr)
	})

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

	r.GET("/installation/dev/scene.json", func(c *gin.Context) {
		c.JSON(200, theScene)
	})

	r.StaticFile("/", "./boss-ui/build/index.html")
	r.StaticFile("/manifest.json", "./boss-ui/build/manifest.json")
	r.Static("/static", "./boss-ui/build/static")
	r.Static("/media", "./boss-ui/build/media")

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

	dj := &DJ{
		logger:      logger,
		grid:        grid,
		scene:       theScene,
		texts:       theScene.Texts, //TODO: already passing theScene
		headManager: head_manager.NewHeadManager(logger, discovery),
	}

	dj.RunScenes()
}

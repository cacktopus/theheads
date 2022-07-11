package boss

import (
	"embed"
	"github.com/cacktopus/theheads/boss/grid"
	"github.com/cacktopus/theheads/boss/head_manager"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/watchdog"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.uber.org/zap"
	"io/fs"
	"math/rand"
	"net/http"
	"os"
	"time"
)

type Cfg struct {
	ScenePath   string
	SpawnPeriod time.Duration `envconfig:"default=250ms"`
	BossFE      string        `envconfig:"required=false"`
}

var upgrader = websocket.Upgrader{}

//go:embed fe
var fe embed.FS

func Run(env *Cfg, discovery discovery.Discovery) {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	rand.Seed(time.Now().UTC().UnixNano())

	go watchdog.Watch(logger)

	broker := broker.NewBroker()
	go broker.Start()

	theScene, err := scene.BuildInstallation(env.ScenePath)
	if err != nil {
		panic(err)
	}

	grid := grid.NewGrid(
		logger,
		env.SpawnPeriod,
		-10, -10, 10, 10,
		400, 400,
		theScene,
		broker,
	)
	go grid.Start()

	stream(logger, discovery, "head", func(addr string) {
		streamHead(logger, broker, addr)
	})
	stream(logger, discovery, "camera", func(addr string) {
		streamCamera(logger, broker, addr)
	})

	go ManageFocalPoints(logger, theScene, broker, grid)

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger:    logger,
		Port:      8081,
		GrpcSetup: nil,
		HttpSetup: func(r *gin.Engine) error {
			pprof.Register(r)

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
					logger.Info("failed to upgrade websocket", zap.Error(err))
					return
				}
				manageWebsocket(conn, broker)
			}))

			r.GET("/ws2", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
				conn, err := upgrader.Upgrade(w, r, nil)
				if err != nil {
					logger.Info("failed to upgrade websocket", zap.Error(err))
					return
				}
				if err := manageWebsocket2(logger, conn, broker); err != nil {
					logger.Info("websocket error", zap.Error(err))
				}

			}))

			r.GET("/restart", func(c *gin.Context) {
				origin := c.GetHeader("Origin")
				logger.Info("restart", zap.String("origin", origin))

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

			if env.BossFE != "" {
				logger.Info("loading frontend from filesystem", zap.String("path", env.BossFE))
				// TODO: some checking on contents of env.BossFE directory
				r.Static("/fe", env.BossFE)
			} else {
				sub, err := fs.Sub(fe, "fe")
				if err != nil {
					panic(err)
				}
				r.StaticFS("/fe", http.FS(sub))
			}

			return nil
		},
	})

	if err != nil {
		panic(err)
	}

	go func() {
		panic(server.Run())
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

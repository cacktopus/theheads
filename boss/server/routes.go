package server

import (
	"github.com/cacktopus/theheads/boss/app"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net/http"
	"os"
	"time"
)

func SetupRoutes(boss *app.Boss) (*standard_server.Server, error) {
	return standard_server.NewServer(&standard_server.Config{
		Logger:    boss.Logger,
		Port:      8081,
		GrpcSetup: nil,
		HttpSetup: func(r *gin.Engine) error {
			pprof.Register(r)

			r.GET("/installation/dev/scene.json", func(c *gin.Context) {
				c.JSON(200, boss.Scene)
			})

			r.GET("/", func(c *gin.Context) {
				c.Redirect(302, "fe") // TODO: is 302 the correct code here?
			})

			//r.StaticFile("/", "./boss-ui/build/index.html")
			//r.StaticFile("/manifest.json", "./boss-ui/build/manifest.json")
			//r.Static("/static", "./boss-ui/build/static")
			//r.Static("/media", "./boss-ui/build/media")

			r.GET("/ws", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
				conn, err := upgrader.Upgrade(w, r, nil)
				if err != nil {
					boss.Logger.Info("failed to upgrade websocket", zap.Error(err))
					return
				}
				manageWebsocket(conn, boss.Broker)
			}))

			r.GET("/ws2", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
				conn, err := upgrader.Upgrade(w, r, nil)
				if err != nil {
					boss.Logger.Info("failed to upgrade websocket", zap.Error(err))
					return
				}
				if err := manageWebsocket2(boss.Logger, conn, boss.Broker); err != nil {
					boss.Logger.Info("websocket error", zap.Error(err))
				}

			}))

			r.GET("/restart", func(c *gin.Context) {
				origin := c.GetHeader("Origin")
				boss.Logger.Info("restart", zap.String("origin", origin))

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

			r.StaticFS("/fe", http.FS(boss.Frontend))

			return nil
		},
	})
}

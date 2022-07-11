package web

import (
	"embed"
	"fmt"
	"github.com/cacktopus/theheads/common/wsrpc/server"
	"github.com/cacktopus/theheads/web/systemd_analyze"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"html/template"
	"io/fs"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"
)

func serveRevereProxy(target string, rootPath string, res http.ResponseWriter, req *http.Request) {
	dst, _ := url.Parse(target)
	req.URL.Path = strings.TrimPrefix(req.URL.Path, rootPath)
	req.Header.Add("X-WEBAUTH-USER", "jsu")
	proxy := httputil.NewSingleHostReverseProxy(dst)
	proxy.ServeHTTP(res, req)
}

func proxy(c *gin.Engine, path string, host string) {
	c.Any("/"+path+"/*any", func(c *gin.Context) {
		serveRevereProxy(host, path, c.Writer, c.Request)
	})
}

//go:embed logs
var logs embed.FS

func setupRoutes(logger *zap.Logger) func(router *gin.Engine) error {
	return func(router *gin.Engine) error {
		templ := template.Must(template.New("").ParseFS(f, "templates/*.html"))
		router.SetHTMLTemplate(templ)

		proxy(router, "/g", "http://localhost:3000")
		proxy(router, "/grafana", "http://localhost:3000")

		proxy(router, "/c", "http://localhost:5000")
		proxy(router, "/camera", "http://localhost:5000")

		proxy(router, "/b", "http://localhost:8081")
		proxy(router, "/boss", "http://localhost:8081")

		router.GET("/monero/metrics", gin.WrapF(moneroMetrics))

		router.GET("/systemd-plot.svg", gin.WrapF(func(res http.ResponseWriter, req *http.Request) {
			svg, err := systemd_analyze.Plot()
			if err != nil {
				res.WriteHeader(500)
				return
			}
			res.Header().Add("Content-Type", "image/svg+xml")
			_, _ = res.Write(svg)
		}))

		{
			sub, err := fs.Sub(logs, "logs")
			if err != nil {
				panic(err)
			}
			router.StaticFS("/logs", http.FS(sub))
		}

		router.GET("/", index)

		router.GET("/ws", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
			conn, err := new(websocket.Upgrader).Upgrade(w, r, nil)
			if err != nil {
				logger.Error("error upgrading", zap.Error(err))
				return
			}
			err = ManageWebsocket(logger, conn)
			if err != nil {
				logger.Info("error managing", zap.Error(err))
				return
			}
		}))

		return nil
	}
}

func ManageWebsocket(logger *zap.Logger, conn *websocket.Conn) error {
	type Log struct {
		Date time.Time `json:"date"`
	}

	type Reply struct{}

	client, err := server.ManageWebsocket(logger, conn)
	if err != nil {
		return errors.Wrap(err, "manage")
	}
	defer client.Close()

	for range time.NewTicker(2 * time.Second).C {
		reply := &Reply{}
		fmt.Println("sending", "Logger.PrintLog")
		err := client.Call("Logger.PrintLog", &Log{Date: time.Now()}, reply)
		fmt.Println("got reply")
		if err != nil {
			return errors.Wrap(err, "call")
		}
	}

	return nil
}

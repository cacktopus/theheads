package camera

import (
	"context"
	_ "embed"
	"encoding/json"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"net/http"
	_ "net/http/pprof"
	"os"
	"runtime"
	"time"
)

var upgrader = websocket.Upgrader{}

//go:embed fe/index.html
var index []byte

//go:embed fe/jsmpeg.min.js
var jsmpeg []byte

func init() {
	mypid := os.Getpid()

	if runtime.GOOS == "linux" {
		promauto.NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_user_jiffies",
		}, func() float64 {
			return cpumon.ParseProc(mypid, 13)
		})

		promauto.NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_system_jiffies",
		}, func() float64 {
			return cpumon.ParseProc(mypid, 14)
		})

		promauto.NewCounterFunc(prometheus.CounterOpts{
			Name: "heads_camera_cpu_hz",
		}, func() float64 {
			var a = cpumon.GetHz()
			return float64(a)
		})
	}
}

func setupRoutes(logger *zap.Logger, frameBroker *broker.Broker, router *gin.Engine) {
	router.GET("/ws", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, http.Header{"Sec-WebSocket-Protocol": {"null"}})
		if err != nil {
			panic(err)
		}
		defer ws.Close()

		messages := frameBroker.Subscribe()
		defer frameBroker.Unsubscribe(messages)

		for m := range messages {
			msg := m.(*ffmpeg.Buffer)
			err := ws.WriteMessage(websocket.BinaryMessage, msg.Data)
			if err != nil {
				logger.Error("error writing to websocket", zap.Error(err))
				return
			}
		}
	}))

	staticHTML(router, "/jsmpeg.min.js", jsmpeg)
	staticHTML(router, "/index.html", index)
	staticHTML(router, "/", index)

	router.GET("/restart", func(c *gin.Context) {
		go func() {
			time.Sleep(200 * time.Millisecond)
			os.Exit(0)
		}()
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})
}

func staticHTML(router *gin.Engine, path string, content []byte) {
	router.GET(path, func(c *gin.Context) {
		c.Writer.Header()["Content-Type"] = []string{"text/html; charset=utf-8"}
		c.Status(200)
		c.Writer.Write(content)
	})
}

type handler struct {
	broker *broker.Broker
	rec    *recorder.Recorder
	logger *zap.Logger
}

func (h *handler) StartRecording(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	h.rec.Record()
	return &gen.Empty{}, nil
}

func (h *handler) StopRecording(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	h.rec.Stop()
	return &gen.Empty{}, nil
}

func (h *handler) Restart(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	go func() {
		time.Sleep(200 * time.Millisecond)
		os.Exit(0)
	}()

	return &gen.Empty{}, nil
}

func (h *handler) Events(empty *gen.Empty, server gen.Camera_EventsServer) error {
	messages := h.broker.Subscribe()
	defer h.broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			panic(err)
		}

		err = server.Send(&gen.Event{
			Type: m.Name(),
			Data: string(data),
		})

		if err != nil {
			break
		}
	}

	h.logger.Info("Events() handler finished")
	return nil
}

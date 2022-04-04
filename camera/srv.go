package camera

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/sirupsen/logrus"
	"html/template"
	"net/http"
	_ "net/http/pprof"
	"os"
	"runtime"
	"time"
)

var upgrader = websocket.Upgrader{}

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

func setupRoutes(frameBroker *broker.Broker, router *gin.Engine, port int) {
	router.Static("/js", "./js")

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
				logrus.WithError(err).Error("ws write")
				return
			}
		}
	}))

	router.GET("/", gin.WrapF(func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := template.ParseFiles("index.html")
		if err != nil {
			panic(err)
		}
		err = tmpl.Execute(w, struct{ WSPort string }{fmt.Sprintf("%d", port)})
		if err != nil {
			panic(err)
		}
	}))

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

type handler struct {
	broker *broker.Broker
	rec    *recorder.Recorder
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
			Data: data,
		})

		if err != nil {
			break
		}
	}

	logrus.Info("Events() handler finished")
	return nil
}

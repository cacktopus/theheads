package camera

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"html/template"
	"net"
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

func serveHTTP(frameBroker *broker.Broker, listener net.Listener, port string) {
	http.HandleFunc("/jsmpeg.min.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "js/jsmpeg.min.js")
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, http.Header{"Sec-WebSocket-Protocol": {"null"}})
		if err != nil {
			panic(err)
		}
		defer ws.Close()

		messages := frameBroker.Subscribe()
		defer frameBroker.Unsubscribe(messages)

		for m := range messages {
			msg := m.(*Buffer)
			err := ws.WriteMessage(websocket.BinaryMessage, msg.data)
			if err != nil {
				logrus.WithError(err).Error("ws write")
				return
			}
		}
	})

	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl, err := template.ParseFiles("index.html")
		if err != nil {
			panic(err)
		}
		err = tmpl.Execute(w, struct{ WSPort string }{fmt.Sprintf("%d", port)})
		if err != nil {
			panic(err)
		}
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK\n"))
	})

	http.HandleFunc("/restart", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK\n"))
		go func() {
			time.Sleep(200 * time.Millisecond)
			os.Exit(0)
		}()
	})

	err := http.Serve(listener, nil)
	if err != nil {
		panic(err)
	}

	logrus.Info("Serving http")
}

type handler struct {
	broker *broker.Broker
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

func serveGRPC(listener net.Listener, broker *broker.Broker) {
	h := &handler{
		broker: broker,
	}

	s := grpc.NewServer()
	gen.RegisterCameraServer(s, h)
	reflection.Register(s)

	err := s.Serve(listener)
	if err != nil {
		panic(err)
	}
}

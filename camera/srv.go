package main

import (
	"fmt"
	"github.com/cacktopus/heads/camera/cpumon"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"html/template"
	"net/http"
	_ "net/http/pprof"
	"os"
	"runtime"
	"sync"
)

var clients = make(map[*websocket.Conn]bool) // connected clients
var clientsLock sync.RWMutex

var upgrader = websocket.Upgrader{}

var broadcast = make(chan []byte)

var (
	wsConnected = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_camera_websocket_connected",
	})

	wsDisconnected = promauto.NewCounter(prometheus.CounterOpts{
		Name: "heads_camera_websocket_disconnected",
	})
)

func numConnectedWebsockets() int {
	clientsLock.RLock()
	defer clientsLock.RUnlock()
	return len(clients)
}

func broadcaster() {
	for {
		var deadClients []*websocket.Conn
		body := <-broadcast
		func() {
			clientsLock.RLock()
			defer clientsLock.RUnlock()
			for client := range clients {
				// TODO: seems that a slow client could block other clients with this approach
				//fmt.Println("Write: ", len(body), client.RemoteAddr())
				err := client.WriteMessage(websocket.BinaryMessage, body)
				if err != nil {
					fmt.Println("Write error ", client.RemoteAddr())
					deadClients = append(deadClients, client)
				}
			}
		}()
		if len(deadClients) > 0 {
			func() {
				clientsLock.Lock()
				defer clientsLock.Unlock()
				for _, client := range deadClients {
					client.Close() // check error?
					delete(clients, client)
					wsDisconnected.Inc()
				}
			}()
		}
	}
}

const (
	port = 5000
)

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

func home(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("index.html")
	if err != nil {
		panic(err)
	}
	err = tmpl.Execute(w, struct{ WSPort string }{fmt.Sprintf("%d", port)})
	if err != nil {
		panic(err)
	}
}

func serve() {
	go broadcaster()

	http.HandleFunc("/jsmpeg.min.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "js/jsmpeg.min.js")
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, http.Header{"Sec-WebSocket-Protocol": {"null"}})
		if err != nil {
			panic(err)
		}
		wsConnected.Inc()
		clients[ws] = true
	})

	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/", home)

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK\n"))
	})

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		panic(err)
	}
}

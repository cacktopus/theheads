package camera

import (
	"context"
	_ "embed"
	"encoding/json"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	_ "net/http/pprof"
	"os"
	"time"
)

var upgrader = websocket.Upgrader{}

//go:embed fe/index.html
var index []byte

//go:embed fe/jsmpeg.min.js
var jsmpeg []byte

func setupRoutes(
	logger *zap.Logger,
	env *cfg.Cfg,
	frameBroker *broker.Broker,
	router *gin.Engine,
) {
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

	if env.WriteFacesPath != "" {
		path := os.ExpandEnv(env.WriteFacesPath)
		router.StaticFS("/faces/", gin.Dir(path, true))
	}
}

func staticHTML(router *gin.Engine, path string, content []byte) {
	router.GET(path, func(c *gin.Context) {
		c.Writer.Header()["Content-Type"] = []string{"text/html; charset=utf-8"}
		c.Status(200)
		c.Writer.Write(content)
	})
}

type handler struct {
	broker     *broker.Broker
	logger     *zap.Logger
	floodlight *floodlight.Floodlight
	camera     *Camera
}

func (h *handler) DetectFaces(ctx context.Context, in *gen.DetectFacesIn) (*gen.Empty, error) {
	h.camera.faceDetector.EnableFor(in.EnableFor.AsDuration())
	return &gen.Empty{}, nil
}

func (h *handler) Ping(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	return &gen.Empty{}, nil
}

func (h *handler) SetState(ctx context.Context, in *gen.SetStateIn) (*gen.Empty, error) {
	var err error
	if in.State {
		err = h.floodlight.On()
	} else {
		err = h.floodlight.Off()
	}
	if err != nil {
		return nil, errors.Wrap(err, "set state")
	}
	return &gen.Empty{}, nil
}

func (h *handler) StartRecording(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	return nil, errors.New("not implemented")
}

func (h *handler) StopRecording(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	return nil, errors.New("not implemented")
}

func (h *handler) Restart(ctx context.Context, empty *gen.Empty) (*gen.Empty, error) {
	go func() {
		time.Sleep(200 * time.Millisecond)
		os.Exit(0)
	}()

	return &gen.Empty{}, nil
}

func (h *handler) Stream(empty *gen.Empty, server gen.Events_StreamServer) error {
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

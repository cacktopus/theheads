package camera

import (
	"bytes"
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/ffmpeg"
	"github.com/cacktopus/theheads/camera/floodlight"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/util"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io"
	"net/http"
	_ "net/http/pprof"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
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

	router.GET("/mp4/:date/:file", func(c *gin.Context) {
		c.Header("content-type", "video/mp4")
		err := box(
			os.ExpandEnv(env.Outdir),
			c.Param("date"),
			c.Param("file"),
			c.Writer,
		)
		if err != nil {
			logger.Info("box error", zap.Error(err))
			c.AbortWithStatus(500)
		}
	})

	router.GET("/mp4/:date", func(c *gin.Context) {
		outdir := os.ExpandEnv(env.Outdir)
		pattern := filepath.Join(
			outdir,
			filepath.Clean(filepath.Join(c.Param("date"))),
			"*.h264",
		)

		matches, err := filepath.Glob(pattern)
		if err != nil {
			c.AbortWithStatus(500)
			return
		}

		var result []string
		var sizes []int64
		for _, match := range matches {
			rel, err := filepath.Rel(outdir, match)
			if err != nil {
				c.AbortWithStatus(500)
				return
			}

			base := strings.TrimSuffix(rel, filepath.Ext(rel))
			result = append(result, filepath.Join(base+".mp4"))

			stat, err := os.Stat(match)
			if err != nil {
				logger.Info("stat failed", zap.Error(err))
				c.AbortWithStatus(500)
				return
			}

			sizes = append(sizes, stat.Size())
		}

		c.Header("content-type", "text/html")
		c.Writer.Write([]byte("<html><body><table>"))
		for idx := range result {
			link := result[idx]
			sz := sizes[idx]
			row := fmt.Sprintf(
				`<tr> <td>%d.</td> <td><a href="%s">%s</a></td> <td>%.1f MB</td> </tr>`,
				idx+1,
				link,
				link,
				float64(sz)/(1024.0*1024.0),
			)
			c.Writer.Write([]byte(row))
		}
		c.Writer.Write([]byte("</table></body></html>"))
	})

	router.GET("/mp4", func(c *gin.Context) {
		content, err := mp4Index(os.ExpandEnv(env.Outdir))
		if err != nil {
			c.AbortWithStatus(500)
			return
		}
		c.Header("content-type", "text/html")
		c.Writer.Write([]byte(content))
	})
}

func mp4Index(outdir string) (string, error) {
	result := bytes.NewBuffer(nil)

	write := func(s string) {
		result.Write([]byte(s))
	}

	write("<html><body><table>")

	matches, err := filepath.Glob(filepath.Join(outdir, "*-*-*"))
	if err != nil {
		return "", err
	}

	sort.Strings(matches)

	for _, match := range matches {
		stat, err := os.Stat(match)
		if err != nil {
			return "", errors.Wrap(err, "stat")
		}
		if !stat.IsDir() {
			continue
		}
		rel, err := filepath.Rel(outdir, match)
		if err != nil {
			return "", errors.Wrap(err, "rel")
		}

		row := fmt.Sprintf(
			`<tr> <td><a href="mp4/%s">%s</a></td> </tr>`,
			rel,
			rel,
		)
		write(row)
	}

	write("</table></body></html>")

	return result.String(), nil
}

func box(outdir string, date string, file string, w io.Writer) error {
	path := filepath.Join(
		outdir,
		filepath.Clean(filepath.Join(date, file)),
	)

	base := strings.TrimSuffix(path, filepath.Ext(path))
	orig := base + ".h264"

	if !util.Exists(orig) {
		return errors.New("orig doesn't exist")
	}

	tmpdir, err := os.MkdirTemp("", "")
	if err != nil {
		return errors.Wrap(err, "tmpdir")
	}

	tmpfile := filepath.Join(tmpdir, "1.mp4")

	defer func() {
		_ = os.RemoveAll(tmpdir)
	}()

	args := []string{
		"MP4Box", "-add", orig, tmpfile,
	}

	cmd := exec.Command(args[0], args[1:]...)
	err = cmd.Run()
	if err != nil {
		return errors.Wrap(err, "run")
	}

	fp, err := os.Open(tmpfile)
	if err != nil {
		return errors.Wrap(err, "open")
	}
	defer func() {
		_ = fp.Close()
	}()

	_, err = io.Copy(w, fp)
	if err != nil {
		return errors.Wrap(err, "copy")
	}
	return nil
}

func staticHTML(router *gin.Engine, path string, content []byte) {
	router.GET(path, func(c *gin.Context) {
		c.Writer.Header()["Content-Type"] = []string{"text/html; charset=utf-8"}
		c.Status(200)
		c.Writer.Write(content)
	})
}

type handler struct {
	env        *cfg.Cfg
	broker     *broker.Broker
	logger     *zap.Logger
	floodlight *floodlight.Floodlight
	camera     *Camera
}

func (h *handler) DetectFaces(ctx context.Context, in *heads.DetectFacesIn) (*heads.Empty, error) {
	h.camera.faceDetector.EnableFor(in.EnableFor.AsDuration())
	return &heads.Empty{}, nil
}

func (h *handler) Ping(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	return &heads.Empty{}, nil
}

func (h *handler) SetState(ctx context.Context, in *heads.SetStateIn) (*heads.Empty, error) {
	var err error
	if in.State {
		err = h.floodlight.On()
	} else {
		err = h.floodlight.Off()
	}
	if err != nil {
		return nil, errors.Wrap(err, "set state")
	}
	return &heads.Empty{}, nil
}

func (h *handler) StartRecording(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	return nil, errors.New("not implemented")
}

func (h *handler) StopRecording(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	return nil, errors.New("not implemented")
}

func (h *handler) Restart(ctx context.Context, empty *heads.Empty) (*heads.Empty, error) {
	go func() {
		time.Sleep(200 * time.Millisecond)
		os.Exit(0)
	}()

	return &heads.Empty{}, nil
}

func (h *handler) Stream(empty *heads.Empty, server heads.Events_StreamServer) error {
	messages := h.broker.Subscribe()
	defer h.broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			panic(err)
		}

		err = server.Send(&heads.Event{
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

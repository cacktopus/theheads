package voices

import (
	"github.com/cacktopus/theheads/common/util"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"go.uber.org/zap"
	"net"
	"net/http"
	"os/exec"
	"path/filepath"
	"sync/atomic"
)

type Cfg struct {
	MediaPath string
}

type Server struct {
	listener net.Listener
	cfg      *Cfg
	logger   *zap.Logger

	playing int32
}

func NewServer(cfg *Cfg, logger *zap.Logger) *Server {
	return &Server{
		cfg:    cfg,
		logger: logger,
	}
}

func (s *Server) Setup() error {
	var err error

	s.listener, err = net.Listen("tcp", "0.0.0.0:3031")
	if err != nil {
		return errors.Wrap(err, "listen")
	}
	return nil
}

var AlreadyPlayingErr = errors.New("already playing")

func (s *Server) play(filename string) error {
	free := atomic.CompareAndSwapInt32(&s.playing, 0, 1)
	if !free {
		return AlreadyPlayingErr
	}
	defer atomic.StoreInt32(&s.playing, 0)

	args := append(execPlay, filename)

	cmd := exec.Command(args[0], args[1:]...)
	err := cmd.Run()
	if err != nil {
		return errors.Wrap(err, "play "+filename)
	}

	return nil
}

func (s *Server) Serve() {
	router := gin.New()
	router.Use(gin.Recovery())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	router.GET("/play", func(c *gin.Context) {
		sound := c.Query("sound")

		// TODO: prevent ../path style attacks
		filename := filepath.Join(
			s.cfg.MediaPath,
			sound,
		)

		logger := s.logger.With(zap.String("filename", filename))

		if !util.Exists(filename) {
			logger.Error("media not found")
			c.Status(http.StatusNotFound)
			return
		}

		err := s.play(filename)
		if err == AlreadyPlayingErr {
			c.Status(http.StatusServiceUnavailable)
			logger.Warn("already playing", zap.Error(err))
			return
		} else if err != nil {
			logger.Error("error playing", zap.Error(err))
			c.Status(http.StatusInternalServerError)
			return
		}

		c.Status(http.StatusOK)
		return
	})

	router.GET("/random", func(c *gin.Context) {
		c.Status(http.StatusOK)
	})

	err := router.RunListener(s.listener)
	if err != nil {
		panic(err)
	}
}

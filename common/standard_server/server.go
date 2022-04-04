package standard_server

import (
	"bufio"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/soheilhy/cmux"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"io"
	"net"
	"os"
)

type Server struct {
	grpcServer   *grpc.Server
	router       *gin.Engine
	httpListener net.Listener
	grpcListener net.Listener
	mux          cmux.CMux
}

type Config struct {
	Logger    *zap.Logger
	Port      int
	GrpcSetup func(*grpc.Server) error
	HttpSetup func(*gin.Engine) error
}

func NewServer(cfg *Config) (*Server, error) {
	s := &Server{}
	addr := fmt.Sprintf("0.0.0.0:%d", cfg.Port)

	listener, err := net.Listen("tcp", addr)
	if err != nil {
		panic(err)
	}

	s.grpcServer = grpc.NewServer()

	if cfg.GrpcSetup != nil {
		err = cfg.GrpcSetup(s.grpcServer)
		if err != nil {
			panic(err)
		}
	}

	reflection.Register(s.grpcServer)

	rp, wp := io.Pipe()
	go func() {
		scanner := bufio.NewScanner(rp)
		for scanner.Scan() {
			line := scanner.Text()
			cfg.Logger.Info("gin logged", zap.String("line", line))
		}
	}()

	if _, present := os.LookupEnv("GIN_MODE"); !present {
		gin.SetMode(gin.ReleaseMode)
	}
	s.router = gin.New()
	s.router.Use(gin.Recovery())
	skipLogging := []string{"/metrics", "/health"}
	s.router.Use(gin.LoggerWithWriter(wp, skipLogging...))

	if cfg.HttpSetup != nil {
		err = cfg.HttpSetup(s.router)
		if err != nil {
			panic(err)
		}
	}

	s.router.NoRoute(func(c *gin.Context) {
		cfg.Logger.Info(
			"404",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
		)
	})

	s.router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	s.router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	s.mux = cmux.New(listener)
	s.httpListener = s.mux.Match(cmux.HTTP1Fast())
	s.grpcListener = s.mux.Match(cmux.Any())
	s.mux.HandleError(func(err error) bool {
		panic(err) // TODO
	})

	return s, nil
}

func (s *Server) Run() error {
	// TODO: collect all errors and return them instead of panicking
	go func() {
		err := s.grpcServer.Serve(s.grpcListener)
		if err != nil {
			panic(err)
		}
	}()

	go func() {
		err := s.router.RunListener(s.httpListener)
		if err != nil {
			panic(err)
		}
	}()

	err := s.mux.Serve()
	if err != nil {
		panic(err)
	}

	return nil
}

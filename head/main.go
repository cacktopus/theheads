package main

import (
	"context"
	"encoding/json"
	"github.com/cacktopus/theheads/common/redis_publisher"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/head/gen/head"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/fake_stepper"
	"github.com/cacktopus/theheads/head/motor/idle"
	"github.com/cacktopus/theheads/head/motor/messages"
	seeker "github.com/cacktopus/theheads/head/motor/seeker"
	"github.com/cacktopus/theheads/head/motor/stepper"
	"github.com/cacktopus/theheads/head/motor/zero_detector"
	sensor "github.com/cacktopus/theheads/head/sensor"
	"github.com/cacktopus/theheads/head/sensor/gpio_sensor"
	"github.com/cacktopus/theheads/head/sensor/null_sensor"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"
)

const (
	numSteps              = 200
	stepSpeed             = 30 // steps/second
	directionChangePauses = 10

	gpioSensorPin = 21
)

type handler struct {
	controller *motor.Controller
}

type Cfg struct {
	Instance    string
	RedisAddr   string `envconfig:"default=127.0.0.1:6379"`
	FakeStepper bool   `envconfig:"optional"`
}

func (h *handler) Rotation(ctx context.Context, in *head.RotationIn) (*head.Empty, error) {
	panic("implement me")
}

func publishLoop(publisher *redis_publisher.RedisPublisher, cfg *Cfg, h *handler) {
	for {
		time.Sleep(time.Second)

		pos, rot := h.controller.State()

		msg := &messages.Message{
			Type: "active",
			Data: &messages.Data{
				Component: "head",
				Name:      cfg.Instance,
				Extra: &messages.Extra{
					HeadName:     "",
					StepPosition: pos,
					Rotation:     rot,
				},
			},
		}

		enc, err := json.Marshal(msg)
		if err != nil {
			panic(err)
		}

		err = publisher.Send(enc)
		if err != nil {
			panic(err)
		}
	}
}

type logLimiter struct {
	duration time.Duration
	timer    *time.Timer
	lock     sync.Mutex
	blocked  bool
}

func newLogLimiter(duration time.Duration) *logLimiter {
	return &logLimiter{
		duration: duration,
		timer:    time.NewTimer(duration),
	}
}

func (ll *logLimiter) Do(callback func()) {
	run := func() bool {
		ll.lock.Lock()
		defer ll.lock.Unlock()

		if ll.blocked {
			return false
		}

		ll.blocked = true
		ll.timer.Reset(ll.duration)

		go func() {
			<-ll.timer.C
			ll.lock.Lock()
			defer ll.lock.Unlock()
			ll.blocked = false
		}()

		return true
	}()

	if run {
		callback()
	}
}

func main() {
	envCfg := &Cfg{}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}

	err = envconfig.Init(envCfg)
	if err != nil {
		panic(err)
	}

	logger = logger.With(zap.String("instance", envCfg.Instance))

	var driver motor.Motor

	if envCfg.FakeStepper {
		driver = fake_stepper.NewMotor()
	} else {
		driver, err = stepper.New(logger)
		if err != nil {
			panic(err)
		}
	}

	err = driver.Start()
	if err != nil {
		panic(err)
	}

	publisher := redis_publisher.NewRedisPublisher(envCfg.RedisAddr, envCfg.Instance)
	go publisher.Run()

	h := &handler{
		controller: motor.NewController(
			logger,
			driver,
			publisher,
			numSteps,
			stepSpeed,
			directionChangePauses,
			envCfg.Instance,
			idle.New(),
		),
	}

	go h.controller.Run()

	s := grpc.NewServer()
	head.RegisterHeadServer(s, h)
	reflection.Register(s)

	listener, err := net.Listen("tcp", "127.0.0.1:4000")
	if err != nil {
		panic(err)
	}

	go s.Serve(listener)

	router := gin.New()
	router.Use(gin.Recovery())

	seeker := seeker.New(numSteps)

	var sensor sensor.Sensor
	if envCfg.FakeStepper {
		sensor = null_sensor.Sensor{}
	} else {
		sensor = gpio_sensor.New(gpioSensorPin)
	}

	ll := newLogLimiter(250 * time.Millisecond)

	router.GET("/rotation/:rotation", func(c *gin.Context) {
		ll.Do(func() {
			logger.Info("GET", zap.String("path", c.FullPath()))
		})

		c.Status(http.StatusOK)
		s := c.Param("rotation")
		rotation, err := strconv.ParseFloat(s, 64)
		if err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		h.controller.SetActor(seeker)
		h.controller.SetTargetRotation(rotation)
		c.Status(http.StatusOK)
	})

	router.GET("/find_zero", func(c *gin.Context) {
		logger.Info("GET", zap.String("path", c.FullPath()))
		detector := zero_detector.NewDetector(logger, sensor, numSteps, directionChangePauses)
		h.controller.SetActor(detector)
		c.Status(http.StatusOK)
	})

	router.GET("/status", func(c *gin.Context) {
		logger.Info("GET", zap.String("path", c.FullPath()))

		pos, rot := h.controller.State()

		c.JSON(http.StatusOK, &schema.HeadResult{
			Result:     "ok",
			Position:   pos,
			Rotation:   rot,
			Controller: h.controller.ActorName(),
			StepsAway:  0,
			Eta:        0,
		})
	})

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	router.NoRoute(func(c *gin.Context) {
		logger.Info(
			"404",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
		)
	})

	go router.Run("0.0.0.0:8080")

	go publishLoop(publisher, envCfg, h)

	select {}
}

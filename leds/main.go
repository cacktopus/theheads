package leds

import (
	"context"
	"encoding/json"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
)

func setup(env *config, msgBroker *broker.Broker) *Strip {
	strip, err := NewStrip(env, msgBroker)
	if err != nil {
		panic(err)
	}

	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "leds",
		Name:      "scale",
	}, func() float64 {
		return strip.GetScale()
	}))

	// reset
	err = strip.send2()
	if err != nil {
		panic(err)
	}

	return strip
}

func runLeds(
	logger *zap.Logger,
	env *config,
	strip *Strip,
	animations map[string]callback,
	ch <-chan callback,
	done <-chan bool,
) error {
	cb := animations[env.Animation]

	err := mainloop(env, strip, cb, ch, done)
	if err != nil {
		return errors.Wrap(err, "mainloop")
	}

	logger.Info("shutting down leds")

	// cleanup: set to low red
	strip.Each(func(_ int, led *Led) {
		led.r = env.Range.R * env.Lowred
		led.g = 0
		led.b = 0
	})

	err = strip.send2()
	if err != nil {
		return errors.Wrap(err, "send2")
	}

	strip.Fini()

	return nil
}

func mainloop(
	env *config,
	strip *Strip,
	cb callback,
	ch <-chan callback,
	done <-chan bool,
) error {
	startTime := time.Now()
	t0 := startTime

	ticker := time.NewTicker(env.UpdatePeriod)

	for {
		select {
		case new_cb := <-ch:
			startTime = time.Now()
			cb = new_cb
		case <-ticker.C:
			now := time.Now()
			t := now.Sub(startTime).Seconds()
			dt := now.Sub(t0).Seconds()

			if dt > 2*env.UpdatePeriod.Seconds() {
				dt = 2 * env.UpdatePeriod.Seconds()
			}

			cb(env, strip, t, dt)
			t0 = now
			err := strip.send2()
			if err != nil {
				return errors.Wrap(err, "send2")
			}
		case <-done:
			return nil
		}
	}
}

type Handler struct {
	ch         chan callback
	animations map[string]callback
	broker     *broker.Broker
	strip      *Strip
}

func (h *Handler) SetScale(ctx context.Context, in *gen.SetScaleIn) (*gen.Empty, error) {
	h.strip.SetScale(in.Scale)
	return &gen.Empty{}, nil
}

func (h *Handler) Events(empty *gen.Empty, server gen.Leds_EventsServer) error {
	messages := h.broker.Subscribe()
	defer h.broker.Unsubscribe(messages)

	for m := range messages {
		data, err := json.Marshal(m)
		if err != nil {
			return errors.Wrap(err, "marshal json")
		}

		err = server.Send(&gen.Event{
			Type: m.Name(),
			Data: string(data),
		})

		if err != nil {
			break
		}
	}

	return nil
}

func (h *Handler) Run(ctx context.Context, in *gen.RunIn) (*gen.Empty, error) {
	fn, ok := h.animations[in.Name]
	if !ok {
		return nil, errors.New("unknown animation")
	}

	h.ch <- fn
	return &gen.Empty{}, nil
}

func setupKeytable(logger *zap.Logger, attempt int) {
	cmd := exec.Command("/usr/bin/ir-keytable", "-c", "-p", "nec")
	output, err := cmd.CombinedOutput()
	if err != nil {
		logger.Warn(
			"ir-keytable failed",
			zap.Int("attempt", attempt),
			zap.Error(err),
			zap.String("output", string(output)),
		)
	}
}

func Run(logger *zap.Logger) error {
	env := &config{}
	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	go func() {
		for i := 1; i <= 60; i++ {
			// there's some startup race condition, so keep running this for some time
			setupKeytable(logger, i)
			time.Sleep(5 * time.Second)
		}
	}()

	msgBroker := broker.NewBroker()
	go msgBroker.Start()

	strip := setup(env, msgBroker)

	var animations = map[string]callback{
		"rainbow": rainbow(strip),
		"decay":   decay,
		"lowred":  lowred,
		"white":   white,
		"bounce":  Bounce().Tick,
		"cycle1": cycle(
			Bounce().Tick,
			rainbow(strip),
		),
	}

	ch := make(chan callback)

	h := &Handler{
		ch:         ch,
		animations: animations,
		broker:     msgBroker,
		strip:      strip,
	}

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   8082,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterLedsServer(grpcServer, h)
			return nil
		},
		HttpSetup: func(r *gin.Engine) error {
			pprof.Register(r)

			r.GET("/run/:name", func(c *gin.Context) {
				name := c.Param("name")
				fn, ok := animations[name]
				if ok {
					ch <- fn
					c.Header("Access-Control-Allow-Origin", "*")
					c.JSON(200, gin.H{"result": "ok"})
				}
			})
			return nil
		},
	})

	if err != nil {
		panic(err)
	}

	go func() {
		panic(server.Run())
	}()

	if env.EnableIR {
		runIR(ch, msgBroker, animations, strip)
	}

	signals := make(chan os.Signal, 1)
	done := make(chan bool)
	signal.Notify(signals, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		<-signals
		done <- true
	}()

	err = runLeds(logger, env, strip, animations, ch, done)
	return errors.Wrap(err, "run leds")
}

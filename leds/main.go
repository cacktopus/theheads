package leds

import (
	"context"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type config struct {
	NumLeds    int     `envconfig:"default=74"`
	StartIndex int     `envconfig:"default=10"`
	Length     float64 `envconfig:"default=2.466"` // 5.0*74.0/150.0

	Animation string `envconfig:"default=rainbow"`

	UpdatePeriod time.Duration `envconfig:"default=40ms"`
	EnableIR     bool          `envconfig:"default=false"`

	Scale float64 `envconfig:"default=1.0"`

	Lowred float64 `envconfig:"default=0.5"`

	Range struct {
		R float64 `envconfig:"default=0.5"`
		G float64 `envconfig:"default=0.75"`
		B float64 `envconfig:"default=0.75"`
	}

	Debug bool `envconfig:"default=false"`
}

func setup(env *config) *Strip {
	strip, err := NewStrip(env)
	if err != nil {
		panic(err)
	}

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
	ch         chan (callback)
	animations map[string]callback
}

func (h *Handler) Run(ctx context.Context, in *gen.RunIn) (*gen.Empty, error) {
	fn, ok := h.animations[in.Name]
	if !ok {
		return nil, errors.New("unknown animation")
	}

	h.ch <- fn
	return &gen.Empty{}, nil
}

func Run(logger *zap.Logger) error {
	env := &config{}
	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	strip := setup(env)

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
	}

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   8082,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterLedsServer(grpcServer, h)
			return nil
		},
		HttpSetup: func(r *gin.Engine) error {
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
		runIR(ch, animations, strip)
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

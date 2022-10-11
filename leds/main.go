package leds

import (
	"encoding/json"
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/gin-contrib/pprof"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/vrischmann/envconfig"
	"go.uber.org/atomic"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"io/ioutil"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
)

func (app *App) setup() {
	var err error
	app.strip, err = NewStrip(app)
	if err != nil {
		panic(err)
	}

	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "leds",
		Name:      "scale",
	}, func() float64 {
		return app.strip.GetScale()
	}))

	// reset
	err = app.strip.send2()
	if err != nil {
		panic(err)
	}
}

func runLeds(app *App, setting *settings) error {
	app.strip.SetScale(setting.Scale)
	err := mainloop(app, setting.Animation)
	if err != nil {
		return errors.Wrap(err, "mainloop")
	}

	app.logger.Info("shutting down leds")

	// cleanup: set to low red
	app.strip.Each(func(_ int, led *Led) {
		led.r = app.env.Range.R * app.env.Lowred
		led.g = 0
		led.b = 0
	})

	err = app.strip.send2()
	if err != nil {
		return errors.Wrap(err, "send2")
	}

	app.strip.Fini()

	return nil
}

func mainloop(app *App, currentAnimation string) error {
	startTime := time.Now()
	t0 := startTime // might want to rename t0 to tprev?

	ticker := time.NewTicker(app.env.UpdatePeriod)

	for {
		select {
		case req := <-app.ch:
			changed := req.name != currentAnimation
			currentAnimation = req.name

			if changed {
				if req.newStartTime.After(time.UnixMicro(0)) {
					startTime = req.newStartTime
				} else {
					startTime = time.Now()
				}
			}
		case <-ticker.C:
			now := time.Now()
			t := now.Sub(startTime).Seconds()
			dt := now.Sub(t0).Seconds()

			if dt > 2*app.env.UpdatePeriod.Seconds() {
				dt = 2 * app.env.UpdatePeriod.Seconds()
			}

			app.currentAnimation.Store(currentAnimation)
			cb := app.animations[currentAnimation]
			cb(t, dt)
			t0 = now
			err := app.strip.send2()
			if err != nil {
				return errors.Wrap(err, "send2")
			}
		case <-app.done:
			return nil
		}
	}
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

type App struct {
	logger           *zap.Logger
	env              *config
	broker           *broker.Broker
	strip            *Strip
	ch               chan *animateRequest
	animations       map[string]callback
	done             chan bool
	currentAnimation *atomic.String
}

type settings struct {
	Animation string
	Scale     float64
}

func (app *App) saveSettings() {
	animation := app.currentAnimation.Load()
	if animation == "" {
		app.logger.Error("no current animation")
		return
	}

	save := &settings{
		Animation: animation,
		Scale:     app.strip.GetScale(),
	}
	content, _ := json.MarshalIndent(save, "", "  ")
	filename := app.env.ConfigFile

	app.logger.Info(
		"saving settings",
		zap.String("content", string(content)),
		zap.String("filename", filename),
	)

	err := ioutil.WriteFile(filename, content, 0o600)
	if err != nil {
		app.logger.Error("error saving settings", zap.Error(err))
	}
}

func (app *App) loadSettings(s *settings) {
	logger := app.logger.With(zap.String("filename", app.env.ConfigFile))
	content, err := ioutil.ReadFile(app.env.ConfigFile)
	if err != nil {
		logger.Info("unable to load settings file", zap.Error(err))
		return
	}
	err = json.Unmarshal(content, s)
	if err != nil {
		logger.Error("error parsing settings file", zap.Error(err))
		return
	}
	logger.Info("loaded settings file")
}

func Run(logger *zap.Logger) error {
	app := &App{
		logger:           logger,
		currentAnimation: atomic.NewString(""),
	}

	app.env = &config{}

	err := envconfig.Init(app.env)
	if err != nil {
		panic(err)
	}

	settings := &settings{
		Animation: app.env.Animation, // default
		Scale:     app.env.Scale,     //default
	}

	app.loadSettings(settings)

	if app.env.EnableIR {
		go func() {
			for i := 1; i <= 60; i++ {
				// there's some startup race condition, so keep running this for some time
				setupKeytable(logger, i)
				time.Sleep(5 * time.Second)
			}
		}()
	}

	app.broker = broker.NewBroker()
	go app.broker.Start()

	app.setup()

	rb1 := rainbow1(app, &faderConfig{
		timeScale: 0.3,
	})

	rb2 := rainbow2(app, &faderConfig{
		timeScale: 0.03,
	})

	app.animations = map[string]callback{
		"rainbow":      rb1,
		"rainbow1":     rb1,
		"rainbow2":     rb2,
		"decay":        decay(app),
		"lowred":       lowred(app),
		"highred":      highred(app),
		"white":        white(app),
		"solid-random": solidRandom(app),
		"bounce":       Bounce(app).Tick,
		"cycle1": cycle(
			Bounce(app).Tick,
			rb1,
		),
		"raindrops": raindrops(app),
	}

	app.ch = make(chan *animateRequest)

	var h = &Handler{
		app: app,
	}
	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   8082,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterLedsServer(grpcServer, h)
			gen.RegisterPingServer(grpcServer, h)
			return nil
		},
		HttpSetup: func(r *gin.Engine) error {
			pprof.Register(r)

			r.GET("/run/:name", func(c *gin.Context) {
				name := c.Param("name")
				_, ok := app.animations[name]
				if ok {
					app.ch <- &animateRequest{
						name: name,
					}
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

	if app.env.EnableIR {
		runIR(app)
	}

	signals := make(chan os.Signal, 1)
	app.done = make(chan bool)
	signal.Notify(signals, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		<-signals
		app.done <- true
	}()

	err = runLeds(app, settings)
	return errors.Wrap(err, "run leds")
}

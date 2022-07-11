package head

import (
	"github.com/cacktopus/theheads/common/broker"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/cacktopus/theheads/head/cfg"
	headgrpc "github.com/cacktopus/theheads/head/grpc"
	"github.com/cacktopus/theheads/head/log_limiter"
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/motor/fake_stepper"
	"github.com/cacktopus/theheads/head/motor/idle"
	"github.com/cacktopus/theheads/head/motor/stepper"
	"github.com/cacktopus/theheads/head/sensor"
	"github.com/cacktopus/theheads/head/sensor/gpio_sensor"
	"github.com/cacktopus/theheads/head/sensor/magnetometer"
	"github.com/cacktopus/theheads/head/sensor/null_sensor"
	"github.com/cacktopus/theheads/head/voices"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"math"
	"sync"
	"time"
)

func publishLoop(b *broker.Broker, cfg *cfg.Cfg, controller *motor.Controller) {
	for {
		time.Sleep(5 * time.Second)

		state := controller.GetState()

		msg := &schema.Active{
			Component: "head",
			HeadName:  cfg.Instance,
			Extra: schema.Extra{
				HeadName:     "",
				StepPosition: state.Pos,
				Rotation:     state.Rotation(),
			},
		}

		b.Publish(msg)
	}
}

var metricsOnce sync.Once

func Run(env *cfg.Cfg) {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	logger = logger.With(zap.String("instance", env.Instance))

	var driver motor.Motor

	if env.FakeStepper {
		driver = fake_stepper.NewMotor()
	} else {
		driver, err = stepper.New(logger, env.Motor.MotorID)
		if err != nil {
			panic(err)
		}
	}

	err = driver.Start()
	if err != nil {
		panic(err)
	}

	b := broker.NewBroker()
	go b.Start()

	var sensor sensor.Sensor
	if env.FakeStepper {
		sensor = null_sensor.Sensor{}
	} else {
		s := gpio_sensor.New(env.SensorPin)
		err := gpio_sensor.Initialize(s)
		if err != nil {
			logger.Error("error initializing sensor", zap.Error(err))
		}
		sensor = s
	}

	mm, err := magnetometer.Setup(logger, env.EnableMagnetSensor, env.MagnetSensorAddrs)
	if err != nil {
		panic(err)
	}

	controller := motor.NewController(
		logger,
		driver,
		b,
		&env.Motor,
		env.Instance,
		idle.New(),
	)

	go controller.Run()

	go publishLoop(b, env, controller)

	h := headgrpc.NewHandler(
		controller,
		log_limiter.NewLimiter(250*time.Millisecond),
		logger,
		sensor,
		mm,
		&env.Motor,
	)

	s, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   env.Port,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterHeadServer(grpcServer, h)
			gen.RegisterVoicesServer(grpcServer, voices.NewServer(&env.Voices, logger))
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	// hack: use sync.Once to allow multiple instances in-process
	metricsOnce.Do(func() {
		setupMetrics(mm)
	})

	err = s.Run()
	if err != nil {
		panic(err)
	}
}

func setupMetrics(mm magnetometer.Sensor) {
	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "magnet_sensor",
		Name:      "magnetic_field",
	}, func() float64 {
		if !mm.HasHardware() {
			return math.NaN()
		}
		read, err := mm.Read()
		if err != nil {
			return math.NaN()
		}
		return read.B
	}))

	prometheus.MustRegister(prometheus.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "magnet_sensor",
		Name:      "temperature",
	}, func() float64 {
		if !mm.HasHardware() {
			return math.NaN()
		}
		read, err := mm.Read()
		if err != nil {
			return math.NaN()
		}
		return read.Temperature
	}))
}

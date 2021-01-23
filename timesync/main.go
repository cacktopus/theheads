package main

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/common/standard_server"
	"github.com/grandcat/zeroconf"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"math"
	"sort"
	"strings"
	"sync"
	"time"
)

func now() float64 {
	t := time.Now().UnixNano()
	return float64(t) / float64(time.Second)
}

var currentTimestamp = prometheus.NewGaugeFunc(prometheus.GaugeOpts{
	Namespace: "heads",
	Subsystem: "timesync",
	Name:      "current_timestamp",
}, now)

func init() {
	prometheus.MustRegister(currentTimestamp)
}

func synctime(env *cfg, logger *zap.Logger, discovery discovery.Discovery) {
	var lock sync.Mutex
	addrs := map[string]bool{}

	discovery.Discover(context.Background(), "_timesync._tcp", func(entry *zeroconf.ServiceEntry) {
		lock.Lock()
		defer lock.Unlock()

		host := strings.TrimRight(entry.HostName, ".")
		addr := fmt.Sprintf("%s:%d", host, entry.Port)
		addrs[addr] = true
	})

	allAddrs := func() (result []string) {
		lock.Lock()
		defer lock.Unlock()

		for k, _ := range addrs {
			result = append(result, k)
		}

		return
	}

	body := func() {
		addrs := allAddrs()
		logger.Debug("syncing time", zap.Strings("addrs", addrs))

		ch := make(chan float64)

		ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
		defer cancel()

		for _, addr := range addrs {
			// TODO: this needs work and should share code (with e.g. boss)
			go func(addr string) {
				conn, err := grpc.Dial(addr, grpc.WithInsecure())
				if err != nil {
					logger.Warn("dial", zap.Error(err))
					return
				}
				defer conn.Close()
				client := gen.NewTimeClient(conn)
				resp, err := client.Time(ctx, &gen.TimeIn{})
				if err != nil {
					logger.Warn("time rpc failed", zap.Error(err))
					return
				}
				if resp.HasRtc {
					ch <- resp.T
				}
			}(addr)
		}

		var values []float64

	collect:
		for {
			select {
			case val := <-ch:
				values = append(values, val)
			case <-ctx.Done():
				break collect
			}
		}

		if len(values) < 2 {
			logger.Warn("Less than two clock sources found")
			return
		}

		sort.Float64s(values)
		min := values[0]
		max := values[len(values)-1]

		rtcDelta := max - min

		if rtcDelta > 5.0 {
			logger.Warn("Clock source (RTC) delta is too large", zap.Float64("rtcDelta", rtcDelta))
			return
		}

		localDelta := math.Abs(now() - max)
		if localDelta < 5.0 {
			logger.Debug("Local clock is fine, not changing", zap.Float64("localDelta", localDelta))
			return
		}

		if err := setTime(max); err != nil {
			logger.Error("Error setting time", zap.Error(err))
			return
		}

		return
	}

	for range time.NewTicker(env.Interval).C {
		body()
	}
}

type handler struct {
	rtc bool
}

func (h *handler) Time(ctx context.Context, in *gen.TimeIn) (*gen.TimeOut, error) {
	return &gen.TimeOut{
		T:      now(),
		HasRtc: h.rtc,
	}, nil
}

type cfg struct {
	Port     int           `envconfig:"default=8086"`
	RTC      bool          `envconfig:"optional"`
	Interval time.Duration `envconfig:"default=60s"`
}

func run(env *cfg, discovery discovery.Discovery) {
	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	h := &handler{
		rtc: env.RTC,
	}

	server, err := standard_server.NewServer(&standard_server.Config{
		Logger: logger,
		Port:   env.Port,
		GrpcSetup: func(grpcServer *grpc.Server) error {
			gen.RegisterTimeServer(grpcServer, h)
			return nil
		},
	})
	if err != nil {
		panic(err)
	}

	go synctime(env, logger, discovery)

	err = server.Run()
	if err != nil {
		panic(err)
	}
}

func main() {
	env := &cfg{}

	err := envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	run(env, discovery.MDNSDiscovery{})
}

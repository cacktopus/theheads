package sync

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/timesync/cfg"
	"github.com/cacktopus/theheads/timesync/util"
	"github.com/grandcat/zeroconf"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"math"
	"sort"
	"strings"
	"sync"
	"time"
)

const (
	discoveryTimeout = 10 * time.Second
)

func getConns(
	logger *zap.Logger,
	env *cfg.Config,
	discovery discovery.Discovery,
	fastDiscover bool,
) []*grpc.ClientConn {
	ctx, cancel := context.WithTimeout(context.Background(), discoveryTimeout)
	defer cancel()

	var done bool
	var lock sync.Mutex
	var result []*grpc.ClientConn

	discovery.Discover(logger, ctx, "_timesync._tcp", func(entry *zeroconf.ServiceEntry) {
		host := strings.TrimRight(entry.HostName, ".")
		addr := fmt.Sprintf("%s:%d", host, entry.Port)
		logger := logger.With(zap.String("addr", addr))
		logger.Info("found timesync peer")
		conn, timeResp, err := primeConnection(logger, env, ctx, addr)
		if err != nil {
			logger.Warn("error priming connection", zap.Error(err))
			return
		}
		lock.Lock()
		defer lock.Unlock()
		if done {
			return
		}

		if timeResp.HasRtc {
			logger.Info("found rtc")
			result = append(result, conn)
		}

		if fastDiscover && len(result) >= env.MinSources {
			cancel()
		}
	})

	<-ctx.Done()

	lock.Lock()
	defer lock.Unlock()
	done = true
	return result
}

func primeConnection(
	logger *zap.Logger,
	env *cfg.Config,
	ctx context.Context,
	addr string,
) (*grpc.ClientConn, *gen.TimeOut, error) {
	conn, err := grpc.DialContext(ctx, addr, grpc.WithInsecure())
	if err != nil {
		logger.Error("dial", zap.Error(err))
		return nil, nil, errors.Wrap(err, "dial")
	}

	go func() {
		// simply close any connections after some time
		time.Sleep(env.Interval)
		_ = conn.Close()
	}()

	// call time once to determine if we have a time source and also to "prime" the connection
	resp, err := gen.NewTimeClient(conn).Time(ctx, &gen.TimeIn{})
	if err != nil {
		logger.Error("time rpc", zap.Error(err))
		return nil, nil, errors.Wrap(err, "time rpc")
	}

	logger.Info("primed connection", zap.Bool("has_rtc", resp.HasRtc), zap.Float64("t", resp.T))

	return conn, resp, err
}

func getValues(logger *zap.Logger, conns []*grpc.ClientConn) ([]*gen.TimeOut, error) {
	ch := make(chan *gen.TimeOut)

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	for _, conn := range conns {
		go func(conn *grpc.ClientConn) {
			resp, err := gen.NewTimeClient(conn).Time(ctx, &gen.TimeIn{})
			if err != nil {
				logger.Warn("time rpc failed", zap.Error(err))
				return
			}
			ch <- resp
		}(conn)
	}

	var result []*gen.TimeOut

	for {
		select {
		case val := <-ch:
			result = append(result, val)
			if len(result) == len(conns) {
				return result, nil
			}
		case <-ctx.Done():
			return nil, errors.New("timeout reading values")
		}
	}
}

func processValues(env *cfg.Config, logger *zap.Logger, responses []*gen.TimeOut) {
	var values []float64
	for _, resp := range responses {
		if resp.HasRtc {
			values = append(values, resp.T)
		}
	}

	if len(values) < env.MinSources {
		logger.Warn(
			"Not enough clock sources found",
			zap.Int("found", len(values)),
			zap.Int("need", env.MinSources),
		)
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

	localDelta := math.Abs(util.Now() - max)
	if localDelta < 5.0 {
		logger.Info("Local clock is fine, not changing", zap.Float64("localDelta", localDelta))
		return
	}

	if err := util.SetTime(max); err != nil {
		logger.Error("Error setting time", zap.Error(err))
		return
	}

	return
}

func Synctime(env *cfg.Config, logger *zap.Logger, discovery discovery.Discovery, fastDiscover bool) {
	logger = logger.With(zap.Bool("fast_discover", fastDiscover))
	logger.Info("running synctime")
	conns := getConns(logger, env, discovery, fastDiscover)

	if len(conns) == 0 {
		logger.Warn("no connections could be made")
		return
	}

	t0 := time.Now()
	values, err := getValues(logger, conns)
	if err != nil {
		logger.Error("error reading values", zap.Error(err))
		return
	}
	logger.Info("read values", zap.Duration("elapsed_time", time.Now().Sub(t0)))

	processValues(env, logger, values)
}

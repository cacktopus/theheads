package sync

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/cacktopus/theheads/timesync/cfg"
	"github.com/cacktopus/theheads/timesync/util"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"sort"
	"sync"
	"time"
)

const (
	discoveryTimeout = 10 * time.Second
)

var startTime = time.Now()

func getConns(
	logger *zap.Logger,
	env *cfg.Config,
	discover discovery.Discovery,
	fastDiscover bool,
) []*grpc.ClientConn {
	ctx, cancel := context.WithTimeout(context.Background(), discoveryTimeout)
	defer cancel()

	var done bool
	var lock sync.Mutex
	var result []*grpc.ClientConn

	services, err := discover.Discover(logger)
	if err != nil {
		logger.Warn("error discovering services", zap.Error(err))
		return nil
	}

	var servers []*discovery.Entry
	for _, entry := range services {
		if entry.Service == "timesync" {
			servers = append(servers, entry)
		}
	}

	if len(servers) == 0 {
		logger.Debug("no timesync servers found")
		cancel()
	}

	for _, entry := range servers {
		go func(entry *discovery.Entry) {
			addr := fmt.Sprintf("%s:%d", entry.Hostname, entry.Port)
			logger := logger.With(zap.String("addr", addr))
			logger.Debug("found timesync peer")

			conn, timeResp, err := primeConnection(logger, env, ctx, addr)
			if err != nil {
				logger.Debug("error priming connection", zap.Error(err))
				return
			}
			lock.Lock()
			defer lock.Unlock()
			if done {
				return
			}

			if timeResp.HasRtc {
				logger.Debug("found rtc")
				result = append(result, conn)
			}

			if fastDiscover && len(result) >= env.MinSources {
				cancel()
			}
		}(entry)
	}

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
		logger.Debug("dial", zap.Error(err))
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
		logger.Debug("time rpc", zap.Error(err))
		return nil, nil, errors.Wrap(err, "time rpc")
	}

	logger.Debug(
		"primed connection",
		zap.Bool("has_rtc", resp.HasRtc),
		zap.String("t", resp.T.AsTime().String()),
	)

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
				logger.Debug("time rpc failed", zap.Error(err))
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

func processValues(
	env *cfg.Config,
	logger *zap.Logger,
	responses []*gen.TimeOut,
) error {
	var values []time.Time
	for _, resp := range responses {
		if resp.HasRtc {
			values = append(values, resp.T.AsTime())
		}
	}

	if len(values) < env.MinSources {
		err := errors.New("not enough clock sources found")
		logger.Debug(
			err.Error(),
			zap.Int("found", len(values)),
			zap.Int("need", env.MinSources),
		)
		return err
	}

	sort.Slice(values, func(i, j int) bool {
		return values[i].Before(values[j])
	})

	min := values[0]
	max := values[len(values)-1]

	rtcDelta := max.Sub(min)

	if rtcDelta > 5.0 {
		err := errors.New("clock source (RTC) delta is too large")
		logger.Debug(err.Error(), zap.Duration("rtcDelta", rtcDelta))
		return err
	}

	localDelta := time.Now().Sub(max)
	if localDelta < 0 {
		localDelta = -localDelta
	}

	if localDelta < 5*time.Second {
		logger.Debug("local clock is fine, not changing", zap.Duration("localDelta", localDelta))
		return nil
	}

	setTime := max
	logger.Debug(
		"setting system time",
		zap.String("new_time", setTime.UTC().String()),
		zap.String("old_time", time.Now().UTC().String()),
		zap.Duration("elapsed", time.Now().Sub(startTime)),
	)
	if err := util.SetTime(max); err != nil {
		return errors.Wrap(err, "setting time")
	}

	return nil
}

func Synctime(
	env *cfg.Config,
	logger *zap.Logger,
	discovery discovery.Discovery,
	fastDiscover bool,
) error {
	logger = logger.With(zap.Bool("fast_discover", fastDiscover))
	logger.Debug("running synctime")
	conns := getConns(logger, env, discovery, fastDiscover)

	if len(conns) == 0 {
		return errors.New("no connections could be made")
	}

	t0 := time.Now()
	values, err := getValues(logger, conns)
	if err != nil {
		return errors.Wrap(err, "reading values")
	}
	logger.Debug("read values", zap.Duration("elapsed_time", time.Now().Sub(t0)))

	err = processValues(env, logger, values)
	if err != nil {
		return errors.Wrap(err, "process values")
	}

	return nil
}

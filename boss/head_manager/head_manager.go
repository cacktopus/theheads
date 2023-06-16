package head_manager

import (
	"context"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/boss/services"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/cacktopus/theheads/gen/go/heads"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"sync"
	"time"
)

var (
	ErrNoServiceFound = errors.New("no service found")
)

type Stand struct {
	Head    *discovery.Entry
	Cameras []*discovery.Entry
	Leds    *discovery.Entry
}

type HeadManager struct {
	lock             sync.Mutex
	clients          map[string]*Connection
	directory        *services.Directory
	gCheckinDuration prometheus.Gauge
	cConnectionError prometheus.Counter
}

func NewHeadManager(logger *zap.Logger, directory *services.Directory) *HeadManager {
	h := &HeadManager{
		clients:   map[string]*Connection{},
		directory: directory,
		gCheckinDuration: metrics.SimpleGauge(
			prometheus.DefaultRegisterer,
			"boss",
			"head_manager_checkin_duration",
		),
		cConnectionError: metrics.SimpleCounter(
			prometheus.DefaultRegisterer,
			"boss",
			"head_manager_connection_error",
		),
	}

	promauto.NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "boss",
		Name:      "head_manager_connections",
	}, func() float64 {
		return float64(h.NumConnections())
	})

	return h
}

func (h *HeadManager) NumConnections() int {
	h.lock.Lock()
	defer h.lock.Unlock()

	return len(h.clients)
}

func (h *HeadManager) CheckIn(
	ctx context.Context,
	logger *zap.Logger,
	sc *scene.Scene,
	timeout time.Duration,
) {
	logger.Info("checkin")
	t0 := time.Now()
	defer func() {
		duration := time.Now().Sub(t0)
		logger.Info("checkin completed", zap.Duration("duration", duration))
		h.gCheckinDuration.Set(duration.Seconds())
	}()

	found := make(chan *Connection)

	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	remaining := map[string]bool{}
	for _, stand := range sc.Stands {
		// heads
		for _, head := range stand.Heads {
			conn := NewConnection(head.URI())
			remaining[conn.URI] = true
			go h.connect(ctx, logger, found, conn)
		}

		// leds
		for _, head := range stand.Heads {
			conn := NewConnection(head.LedsURI())
			remaining[conn.URI] = true
			go h.connect(ctx, logger, found, conn)
		}

		// cameras
		for _, camera := range stand.Cameras {
			conn := NewConnection(camera.URI())
			remaining[conn.URI] = true
			go h.connect(ctx, logger, found, conn)
		}
	}

	newClients := h.collectResults(
		ctx,
		logger,
		cancel,
		found,
		remaining,
	)
	logger.Info("checkin found clients", zap.Int("count", len(newClients)))

	// Connections may be found after ctx is canceled, let's spend some time closing them
	go h.cleanupLateConnections(found)

	h.lock.Lock()
	defer h.lock.Unlock()
	h.close()
	h.clients = newClients
}

func (h *HeadManager) close() {
	// should only be called while caller holding the lock
	oldClients := h.clients
	h.clients = map[string]*Connection{}

	go func() {
		for _, conn := range oldClients {
			conn.Conn.Close() // TODO: handle error, log, etc.
		}
	}()
}

func (h *HeadManager) connect(
	ctx context.Context,
	parentLogger *zap.Logger,
	found chan *Connection,
	conn *Connection,
) {
	defer func() {
		found <- conn
	}()

	logger := parentLogger.With(
		zap.String("service", conn.Service()),
		zap.String("instance", conn.Instance()),
	)

	instance := h.directory.Instance(conn.Service(), conn.Instance())
	if instance == nil {
		conn.connectErr = errors.New("unknown instance")
		return
	}

	if instance.Addr == "" {
		conn.connectErr = errors.New("no address for service")
		return
	}

	conn.Addr = instance.Addr
	logger = logger.With(zap.String("addr", conn.Addr))

	logger.Debug("checkin found service")

	// TODO: retries
	grpcConn, err := grpc.DialContext(ctx, conn.Addr, grpc.WithInsecure())
	if err != nil {
		conn.connectErr = errors.Wrap(err, "dial")
		return
	}

	_, err = heads.NewPingClient(grpcConn).Ping(ctx, &heads.Empty{})
	if err != nil {
		grpcConn.Close()
		conn.connectErr = errors.Wrap(err, "ping")
	}

	conn.Conn = grpcConn
}

func (h *HeadManager) collectResults(
	ctx context.Context,
	parentLogger *zap.Logger,
	cancel func(),
	found chan *Connection,
	remaining map[string]bool,
) map[string]*Connection {
	newClients := map[string]*Connection{}

	for {
		select {

		case <-ctx.Done():
			return newClients

		case conn := <-found:
			logger := parentLogger.With(zap.String("uri", conn.URI), zap.String("addr", conn.Addr))

			if conn.connectErr != nil {
				h.cConnectionError.Inc()
				logger.Error("error connecting to service", zap.Error(conn.connectErr))
				break
			}

			if _, ok := newClients[conn.URI]; ok {
				logger.Warn("found extra connection")
				conn.Conn.Close()
				break
			}

			delete(remaining, conn.URI)
			newClients[conn.URI] = conn
			logger.Debug("connected to service")

			if len(remaining) == 0 {
				cancel()
			}
		}
	}
}

func (h *HeadManager) cleanupLateConnections(found chan *Connection) {
	timeout := time.After(time.Minute)
	for {
		select {
		case <-timeout:
			close(found)
			return
		case c := <-found:
			c.Conn.Close()
		}
	}
}

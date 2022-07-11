package head_manager

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"sync"
	"time"
)

var (
	ErrNoServiceFound = errors.New("no service found")
)

type Result struct {
	Err        error
	Body       []byte
	StatusCode int
}

type SendItem struct {
	path   string
	result chan Result
}

type HeadManager struct {
	logger    *zap.Logger
	lock      sync.Mutex
	clients   map[string]*grpc.ClientConn
	discovery discovery.Discovery
}

func NewHeadManager(logger *zap.Logger, discovery discovery.Discovery) *HeadManager {
	h := &HeadManager{
		logger:    logger,
		clients:   map[string]*grpc.ClientConn{},
		discovery: discovery,
	}
	return h
}

func (h *HeadManager) CheckIn(ctx context.Context, heads []string) {
	h.logger.Info("checkin")
	t0 := time.Now()
	defer func() {
		h.logger.Info("checkin completed", zap.Duration("duration", time.Now().Sub(t0)))
	}()

	remaining := map[string]bool{}
	for _, head := range heads {
		remaining[head] = true
	}

	type headConn struct {
		name string
		conn *grpc.ClientConn
	}

	found := make(chan *headConn)

	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	services, err := h.discovery.Discover(h.logger)
	if err != nil {
		h.logger.Error("error discovering services", zap.Error(err))
		return
	}

	for _, entry := range services {
		if entry.Service != "head" {
			continue
		}

		go func(entry *discovery.Entry) {
			addr := fmt.Sprintf("%s:%d", entry.Hostname, entry.Port)
			instance := entry.Instance

			h.logger.Info(
				"checkin found head",
				zap.String("instance", instance),
				zap.String("addr", addr),
			)

			// TODO: retries
			// TODO: actually call "ping" method
			conn, err := grpc.DialContext(ctx, addr, grpc.WithInsecure())
			if err != nil {
				h.logger.Error("connecting", zap.String("instance", instance))
				return
			}

			found <- &headConn{
				name: instance,
				conn: conn,
			}
		}(entry)
	}

	newClients := map[string]*grpc.ClientConn{}

	func() {
		for {
			select {

			case <-ctx.Done():
				return

			case head := <-found:
				if _, ok := newClients[head.name]; ok {
					h.logger.Warn("found extra connection", zap.String("name", head.name))
					head.conn.Close()
					break
				}

				if _, ok := remaining[head.name]; !ok {
					h.logger.Warn("found unexpected connection", zap.String("name", head.name))
					head.conn.Close()
					break
				}

				delete(remaining, head.name)
				newClients[head.name] = head.conn
				h.logger.Info("connected to head", zap.String("name", head.name))

				if len(remaining) == 0 {
					cancel()
				}
			}
		}
	}()

	go func() {
		// Connections may be found after ctx is canceled, let's spend some time closing them
		timeout := time.After(time.Minute)
		for {
			select {
			case <-timeout:
				close(found)
				return
			case c := <-found:
				c.conn.Close()
			}
		}
	}()

	h.lock.Lock()
	defer h.lock.Unlock()

	h.clients = newClients
}

func (h *HeadManager) SetTarget(
	ctx context.Context,
	headName string,
	theta float64,
) (*gen.HeadState, error) {
	client, err := h.GetHeadConn(headName)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return gen.NewHeadClient(client).SetTarget(ctx, &gen.SetTargetIn{
		Theta: theta,
	})
}

func (h *HeadManager) SetActor(
	ctx context.Context,
	headName string,
	actor string,
) (*gen.HeadState, error) {
	client, err := h.GetHeadConn(headName)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return gen.NewHeadClient(client).SetActor(ctx, &gen.SetActorIn{
		Actor: actor,
	})
}

func (h *HeadManager) Say(
	ctx context.Context,
	headName string,
	sound string,
) {
	conn, err := h.GetHeadConn(headName)
	if err != nil {
		h.logger.Error("error fetching head connection", zap.Error(err))
		// TODO: might need dj.Sleep()
		time.Sleep(5 * time.Second) // Sleep for length of some typical text
	} else {
		client := gen.NewVoicesClient(conn)
		_, err = client.Play(ctx, &gen.PlayIn{Sound: sound})
		if err != nil {
			h.logger.Error("error playing sound", zap.Error(err), zap.String("sound", sound))
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) SayRandom(
	ctx context.Context,
	headName string,
) {
	conn, err := h.GetHeadConn(headName)
	if err != nil {
		h.logger.Error("error fetching head connection", zap.Error(err))
		// TODO: might need dj.Sleep()
		time.Sleep(5 * time.Second) // Sleep for length of some typical text
	} else {
		client := gen.NewVoicesClient(conn)
		_, err = client.Random(ctx, &gen.Empty{})
		if err != nil {
			h.logger.Error("error playing random sound", zap.Error(err))
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) GetHeadConn(headName string) (*grpc.ClientConn, error) {
	h.lock.Lock()
	defer h.lock.Unlock()

	conn, ok := h.clients[headName]
	if !ok {
		return nil, ErrNoServiceFound
	}

	return conn, nil
}

func (h *HeadManager) Close() {
	h.lock.Lock()
	defer h.lock.Unlock()

	for _, conn := range h.clients {
		conn.Close() // TODO: handle error, log, etc.
	}

	h.clients = map[string]*grpc.ClientConn{}
}

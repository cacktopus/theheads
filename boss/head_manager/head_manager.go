package head_manager

import (
	"context"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/grandcat/zeroconf"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"strings"
	"sync"
	"time"
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

type client struct {
	client *grpc.ClientConn
	lock   sync.Mutex
}

type HeadManager struct {
	logger *zap.Logger
	lock   sync.Mutex

	servicesLock sync.Mutex
	services     map[string]*service

	clients map[string]*client

	discovery discovery.Discovery
}

type service struct {
	host string
	port int
}

func NewHeadManager(logger *zap.Logger, discovery discovery.Discovery) *HeadManager {
	h := &HeadManager{
		logger:   logger,
		services: map[string]*service{},
		clients:  map[string]*client{},
	}

	ctx := context.Background()

	discovery.Discover(logger, ctx, "_head._tcp", func(entry *zeroconf.ServiceEntry) {
		var found bool

		func() {
			h.servicesLock.Lock()
			defer h.servicesLock.Unlock()

			host := strings.TrimRight(entry.HostName, ".")

			_, found = h.services[entry.Instance]

			h.services[entry.Instance] = &service{
				host: host,
				port: entry.Port,
			}
		}()
	})

	return h
}

func (h *HeadManager) Position(headName string, theta float64) (*gen.HeadState, error) {
	client, err := h.GetHeadConn(headName)
	if err != nil {
		return nil, errors.Wrap(err, "get client")
	}
	return gen.NewHeadClient(client).Rotation(context.Background(), &gen.RotationIn{
		Theta: theta,
	})
}

func (h *HeadManager) Say(headName string, sound string) {
	conn, err := h.GetHeadConn(headName)
	if err != nil {
		logrus.WithError(err).Error("error fetching head connection")
		// TODO: might need dj.Sleep()
		time.Sleep(5 * time.Second) // Sleep for length of some typical text
	} else {
		client := gen.NewVoicesClient(conn)
		_, err = client.Play(context.Background(), &gen.PlayIn{Sound: sound})
		if err != nil {
			logrus.WithError(err).Error("error playing sound")
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) SayRandom(headName string) {
	conn, err := h.GetHeadConn(headName)
	if err != nil {
		logrus.WithError(err).Error("error fetching head connection")
		// TODO: might need dj.Sleep()
		time.Sleep(5 * time.Second) // Sleep for length of some typical text
	} else {
		client := gen.NewVoicesClient(conn)
		_, err = client.Random(context.Background(), &gen.Empty{})
		if err != nil {
			logrus.WithError(err).Error("error playing random sound")
			// TODO: might need dj.Sleep()
			time.Sleep(5 * time.Second) // Sleep for length of some typical text
		}
	}
}

func (h *HeadManager) GetHeadConn(headName string) (*grpc.ClientConn, error) {
	var c *client

	func() {
		h.lock.Lock()
		defer h.lock.Unlock()

		var ok bool
		c, ok = h.clients[headName]
		if !ok {
			c = &client{}
			h.clients[headName] = c
		}
	}()

	return func() (*grpc.ClientConn, error) {
		c.lock.Lock()
		defer c.lock.Unlock()

		if c.client != nil {
			return c.client, nil
		}

		var s *service
		var ok bool
		func() {
			h.servicesLock.Lock()
			defer h.servicesLock.Unlock()

			s, ok = h.services[headName]
		}()

		if !ok {
			return nil, errors.New("no service found for " + headName)
		}

		addr := fmt.Sprintf("%s:%d", s.host, +s.port)
		conn, err := grpc.Dial(addr, grpc.WithInsecure())
		if err != nil {
			return nil, errors.Wrap(err, "dial")
		}

		c.client = conn
		return c.client, nil
	}()
}

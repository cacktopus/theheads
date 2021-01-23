package discovery

import (
	"context"
	"github.com/grandcat/zeroconf"
	"go.uber.org/zap"
	"sync"
)

var entries chan *zeroconf.ServiceEntry
var registrations []*registration
var lock sync.Mutex

func init() {
	entries = make(chan *zeroconf.ServiceEntry, 64)
}

type registration struct {
	service  string
	callback func(entry *zeroconf.ServiceEntry)
}

type StaticDiscovery struct {
}

func NewStaticDiscovery() *StaticDiscovery {
	sd := &StaticDiscovery{}
	return sd
}

func (s *StaticDiscovery) Discover(
	logger *zap.Logger,
	ctx context.Context,
	serviceName string,
	callback func(*zeroconf.ServiceEntry),
) {
	lock.Lock()
	defer lock.Unlock()

	registrations = append(registrations, &registration{
		service:  serviceName,
		callback: callback,
	})
}

func (s *StaticDiscovery) Register(
	service string,
	instance string,
	port int,
) {
	entries <- &zeroconf.ServiceEntry{
		ServiceRecord: zeroconf.ServiceRecord{
			Instance: instance,
			Service:  service,
			Domain:   "",
		},
		HostName: "localhost",
		Port:     port,
		AddrIPv4: nil,
		AddrIPv6: nil,
	}
}

func (s *StaticDiscovery) Run() {
	for e := range entries {
		func() {
			lock.Lock()
			defer lock.Unlock()

			for _, r := range registrations {
				if e.Service == r.service {
					go r.callback(e)
				}
			}
		}()
	}
}

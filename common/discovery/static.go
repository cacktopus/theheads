package discovery

import (
	"context"
	"github.com/grandcat/zeroconf"
	"go.uber.org/zap"
	"sync"
)

var entries []*zeroconf.ServiceEntry
var lock sync.Mutex

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
	go s.run(serviceName, callback)
}

func (s *StaticDiscovery) Register(
	service string,
	instance string,
	port int,
) {
	lock.Lock()
	defer lock.Unlock()

	entries = append(entries, &zeroconf.ServiceEntry{
		ServiceRecord: zeroconf.ServiceRecord{
			Instance: instance,
			Service:  service,
			Domain:   "",
		},
		HostName: "localhost",
		Port:     port,
		AddrIPv4: nil,
		AddrIPv6: nil,
	})
}

func (s *StaticDiscovery) run(serviceName string, callback func(entry *zeroconf.ServiceEntry)) {
	lock.Lock()
	defer lock.Unlock()

	for _, e := range entries {
		if e.Service == serviceName {
			go callback(e)
		}
	}
}

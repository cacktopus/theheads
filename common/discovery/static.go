package discovery

import (
	"go.uber.org/zap"
	"sync"
)

type StaticDiscovery struct {
	entries []*Entry
	lock    sync.Mutex
}

func (s *StaticDiscovery) Discover(logger *zap.Logger) ([]*Entry, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	copied := append([]*Entry{}, s.entries...)
	return copied, nil
}

func (s *StaticDiscovery) Register(
	service string,
	instance string,
	port int,
) {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.entries = append(s.entries, &Entry{
		Hostname: "localhost",
		Port:     port,
		Instance: instance,
		Service:  service,
	})
}

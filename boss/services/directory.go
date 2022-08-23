package services

import (
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"sync"
	"time"
)

type Directory struct {
	logger   *zap.Logger
	discover discovery.Discovery
	lock     sync.Mutex
	services map[string]*discovery.Entry
}

func NewDirectory(logger *zap.Logger, discover discovery.Discovery) *Directory {
	return &Directory{
		logger:   logger,
		discover: discover,
		services: map[string]*discovery.Entry{},
	}
}

func (d *Directory) Run() error {
	if err := d.discoverOnce(); err != nil {
		return errors.Wrap(err, "initial discovery failed")
	}

	go d.backgroundDiscovery()
	return nil
}

func (d *Directory) backgroundDiscovery() {
	for {
		time.Sleep(5 * time.Second)
		if err := d.discoverOnce(); err != nil {
			d.logger.Error("error discovering services", zap.Error(err))
		}
	}
}

func (d *Directory) Instance(service, instance string) *discovery.Entry {
	key := fmt.Sprintf("[%s]::[%s]", service, instance)

	d.lock.Lock()
	defer d.lock.Unlock()

	return d.services[key]
}

func (d *Directory) Instances(service string) []*discovery.Entry {
	var result []*discovery.Entry

	d.lock.Lock()
	defer d.lock.Unlock()

	// we could do better here than a full scan
	for _, entry := range d.services {
		if entry.Service == service {
			result = append(result, entry)
		}
	}

	return result
}

func (d *Directory) discoverOnce() error {
	services, err := d.discover.Discover(d.logger)
	if err != nil {
		return errors.Wrap(err, "discover")
	}

	d.lock.Lock()
	defer d.lock.Unlock()

	for _, service := range services {
		// TODO: a lot of these services don't have an instance set, and they will clobber each-other
		key := fmt.Sprintf("[%s]::[%s]", service.Service, service.Instance)
		d.services[key] = service
	}

	return nil
}

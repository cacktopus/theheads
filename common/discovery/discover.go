package discovery

import (
	"context"
	"github.com/grandcat/zeroconf"
	"go.uber.org/zap"
)

type Discovery interface {
	Discover(
		logger *zap.Logger,
		ctx context.Context,
		serviceName string,
		callback func(*zeroconf.ServiceEntry),
	)
}

type MDNSDiscovery struct{}

func (MDNSDiscovery) Discover(
	logger *zap.Logger,
	ctx context.Context,
	serviceName string,
	callback func(*zeroconf.ServiceEntry),
) {
	resolver, err := zeroconf.NewResolver(nil)
	if err != nil {
		logger.Fatal("failed to initialize resolver", zap.Error(err))
	}

	entries := make(chan *zeroconf.ServiceEntry)
	go func(results <-chan *zeroconf.ServiceEntry) {
		for entry := range results {
			go callback(entry)
		}
		logger.Debug("No more entries")
	}(entries)

	err = resolver.Browse(ctx, serviceName, "local.", entries)
	if err != nil {
		logger.Fatal("failed to browse", zap.Error(err))
	}
}

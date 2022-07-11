package discovery

import (
	"go.uber.org/zap"
)

type Entry struct {
	Service  string `json:"service"`
	Instance string `json:"instance,omitempty"`

	Hostname string `json:"hostname"`
	Port     int    `json:"port,omitempty"`
}

type Discovery interface {
	Discover(
		logger *zap.Logger,
	) ([]*Entry, error)
}

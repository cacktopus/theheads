package web

import (
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"sort"
)

type Host struct {
	Hostname string
	Port     int
	Path     string
}

type Service struct {
	Name  string
	Hosts []*Host
}

func transform(s *Service, h *Host) *Host {
	switch s.Name {
	case "camera", "boss", "web", "head", "leds":
		return &Host{
			Hostname: h.Hostname,
			Port:     h.Port,
		}
	case "grafana":
		return &Host{
			Hostname: h.Hostname,
			Port:     80,
			Path:     "/grafana",
		}
	default:
		return nil
	}
}

func index(discover discovery.Discovery) func(c *gin.Context) {
	return func(c *gin.Context) {
		logger, _ := zap.NewProduction()

		var serfError string

		found, err := discover.Discover(logger)
		if err != nil {
			serfError = errors.Wrap(err, "service discovery failed").Error()
		}

		serviceMap := map[string][]*discovery.Entry{}
		for _, entry := range found {
			serviceMap[entry.Service] = append(serviceMap[entry.Service], entry)
		}

		var services []*Service
		for name, entries := range serviceMap {
			service := &Service{
				Name: name,
			}

			for _, entry := range entries {
				host := transform(service, &Host{
					Hostname: entry.Hostname,
					Port:     entry.Port,
				})

				if host != nil {
					service.Hosts = append(service.Hosts, host)
				}
			}

			sort.Slice(service.Hosts, func(i, j int) bool {
				return service.Hosts[i].Hostname < service.Hosts[j].Hostname
			})

			if len(service.Hosts) > 0 {
				services = append(services, service)
			}
		}

		sort.Slice(services, func(i, j int) bool {
			return services[i].Name < services[j].Name
		})

		c.HTML(http.StatusOK, "index.html", gin.H{
			"title":     "heads home",
			"body":      "body2",
			"serfError": serfError,
			"services":  services,
		})
	}
}

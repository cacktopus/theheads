package healthcheck

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"sync"
)

var (
	healthy   = make(map[int]bool)
	unhealthy = make(map[int]bool)
	lock      sync.Mutex

	healthyGauge = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "rtunneld_healthy_tunnels",
		Help: "The total number of healthy tunnels",
	})
)

func SetHealthy(index int) {
	lock.Lock()
	defer lock.Unlock()
	healthy[index] = true
	delete(unhealthy, index)
	healthyGauge.Set(float64(len(healthy)))
}

func SetUnhealthy(index int) {
	lock.Lock()
	defer lock.Unlock()
	unhealthy[index] = true
	delete(healthy, index)
	healthyGauge.Set(float64(len(healthy)))
}

func Remove(index int) {
	lock.Lock()
	defer lock.Unlock()
	delete(healthy, index)
	delete(unhealthy, index)
	healthyGauge.Set(float64(len(healthy)))
}

package healthcheck

import (
	"errors"
	"github.com/cacktopus/theheads/rtunneld/config"
	"github.com/cacktopus/theheads/rtunneld/util"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/ssh"
	"time"
)

var (
	healthCheckFailed = promauto.NewCounter(prometheus.CounterOpts{
		Name: "rtunneld_healthcheck_failures",
		Help: "The total number of failed health checks",
	})

	healthCheckSuccess = promauto.NewCounter(prometheus.CounterOpts{
		Name: "rtunneld_healthcheck_successes",
		Help: "The total number of successful health checks",
	})
)

func HealthCheck(tunnel *config.Tunnel, sshConfig *ssh.ClientConfig, closeListener util.BroadcastCloser, tunnelIndex int, checker Checker) {
	hcLog := log.WithFields(log.Fields{
		"component": "healthCheck",
		"index":     tunnelIndex,
		"name":      tunnel.Name,
	})
	hcLog.Info("start")

loop:
	for iteration := 1; ; iteration++ {
		select {
		case <-closeListener.Chan():
			hcLog.Info("Breaking loop")
			break loop
		default:
		}

		iLog := hcLog.WithFields(log.Fields{"iteration": iteration})

		var interval time.Duration = 60 * time.Second
		if tunnel.HealthcheckInterval > 0 {
			interval = tunnel.HealthcheckInterval * time.Second
		}

		time.Sleep(interval)

		iLog.Info("Begin iteration")

		ret := make(chan error)
		go func() {
			ret <- checker(tunnel, sshConfig, iLog)
		}()

		var err error
		select {
		case err = <-ret:
		case <-time.After(15 * time.Second):
			err = errors.New("read timed out")
		}

		if err != nil {
			iLog.WithError(err).Error("health check failed")
			healthCheckFailed.Inc()
			SetUnhealthy(tunnelIndex)
			closeListener.Close()
		} else {
			healthCheckSuccess.Inc()
			SetHealthy(tunnelIndex)
		}
	}
}

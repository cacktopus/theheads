package healthcheck

import (
	"errors"
	"github.com/cacktopus/theheads/rtunneld/config"
	"github.com/cacktopus/theheads/rtunneld/util"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
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

func HealthCheck(
	logger *zap.Logger,
	tunnel *config.Tunnel,
	sshConfig *ssh.ClientConfig,
	closeListener util.BroadcastCloser,
	tunnelIndex int,
	checker Checker,
) {
	hcLogger := logger.With(
		zap.String("component", "healthCheck"),
		zap.Int("index", tunnelIndex),
		zap.String("name", tunnel.Name),
	)
	hcLogger.Info("start")

loop:
	for iteration := 1; ; iteration++ {
		select {
		case <-closeListener.Chan():
			hcLogger.Info("Breaking loop")
			break loop
		default:
		}

		iLogger := hcLogger.With(zap.Int("iteration", iteration))

		var interval time.Duration = 60 * time.Second
		if tunnel.HealthcheckInterval > 0 {
			interval = tunnel.HealthcheckInterval * time.Second
		}

		time.Sleep(interval)

		iLogger.Info("begin iteration")

		ret := make(chan error)
		go func() {
			ret <- checker(logger, tunnel, sshConfig)
		}()

		var err error
		select {
		case err = <-ret:
		case <-time.After(15 * time.Second):
			err = errors.New("read timed out")
		}

		if err != nil {
			iLogger.Error("health check failed", zap.Error(err))
			healthCheckFailed.Inc()
			SetUnhealthy(tunnelIndex)
			closeListener.Close()
		} else {
			healthCheckSuccess.Inc()
			SetHealthy(tunnelIndex)
		}
	}
}

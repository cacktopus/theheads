package system_tools

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/serf_service"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io/ioutil"
	"os"
	"path"
	"strings"
	"time"
)

type Cfg struct {
	OutputDir string `envconfig:"optional"`
}

type scrapeConfig struct {
	Targets []string          `json:"targets"`
	Labels  map[string]string `json:"labels"`
}

func serviceName(s string) string {
	return strings.TrimPrefix(
		strings.Split(s, ".")[0],
		"_",
	)
}

func discoverPrometheus(logger *zap.Logger, env *Cfg) {
	ticker := time.NewTicker(time.Minute)

	for {
		err := discoverLoop(logger, env)
		if err != nil {
			logger.Error("error running discovery loop", zap.Error(err))
		}

		<-ticker.C
	}

}

func discoverLoop(logger *zap.Logger, env *Cfg) error {
	logger.Debug("running discovery loop")

	serfClient, err := client.NewRPCClient("127.0.0.1:7373")
	if err != nil {
		return errors.Wrap(err, "connect")
	}
	defer serfClient.Close()

	serfServices, err := serf_service.LoadServices(logger, serfClient)
	if err != nil {
		return errors.Wrap(err, "load services")
	}

	for _, srv := range serfServices {
		if srv.ServicePort == 0 {
			continue
		}

		buildPromFile(logger, env, &prometheusService{
			Hostname:    srv.Host,
			ServiceName: srv.Name,
			Port:        srv.ServicePort,
		})
	}

	return nil
}

type prometheusService struct {
	Hostname    string
	ServiceName string
	Port        int
}

func buildPromFile(logger *zap.Logger, env *Cfg, entry *prometheusService) {
	logger = logger.With(
		zap.String("service", entry.ServiceName),
		zap.String("hostname", entry.Hostname),
	)

	job := serviceName(entry.ServiceName)

	if entry.Hostname == "raspberrypi" {
		// TODO: log
		return // silently ignore
	}

	target := fmt.Sprintf("%s:%d", entry.Hostname, entry.Port)

	cfg := scrapeConfig{
		Targets: []string{
			target,
		},
		Labels: map[string]string{
			"job":  job,
			"host": entry.Hostname,
		},
	}

	filename := strings.Replace(fmt.Sprintf("%s-%s", job, entry.Hostname), ".", "_", -1) + ".yml"
	fn := path.Join(env.OutputDir, filename)

	configs := []*scrapeConfig{&cfg}
	content, err := json.MarshalIndent(configs, "", "  ")

	existing := []byte("")

	logger = logger.With(
		zap.Int("prometheus_port", entry.Port),
		zap.String("filename", filename),
	)

	_, err = os.Stat(fn)
	if err == nil {
		existing, err = ioutil.ReadFile(fn)
		if err != nil {
			panic(err)
		}
	} else if !os.IsNotExist(err) {
		panic(err)
	}

	if bytes.Equal(content, existing) {
		logger.Debug("contents were equal, skipping")
	} else {
		logger.Info("adding new service")
		err = ioutil.WriteFile(fn, content, 0o644)
		if err != nil {
			panic(err)
		}
	}
}

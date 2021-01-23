package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/grandcat/zeroconf"
	"go.uber.org/zap"
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"strings"
	"time"
)

type Cfg struct {
	OutputDir string `envconfig:"optional"`
	UseIPS    bool   `envconfig:"optional"`
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
		discoverLoop(logger, env)

		<-ticker.C
	}

}

func discoverLoop(logger *zap.Logger, env *Cfg) {
	logger.Debug("running discovery loop")

	ctx := context.Background()
	ctx, cancel := context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	discovery.MDNSDiscovery{}.Discover(logger, ctx, "_services._dns-sd._udp", func(nameEntry *zeroconf.ServiceEntry) {
		svc := strings.TrimSuffix(nameEntry.Instance, ".local")
		discovery.MDNSDiscovery{}.Discover(logger, ctx, svc, func(entry *zeroconf.ServiceEntry) {
			tags := map[string]string{}
			for _, t := range entry.Text {
				if !strings.Contains(t, "=") {
					continue
				}
				parts := strings.SplitN(t, "=", 2)
				key, val := parts[0], parts[1]
				tags[key] = val
			}
			strPort, ok := tags["prometheus_metrics_port"]
			if ok {
				buildPromFile(logger, env, entry, strPort)
			}
		})
	})

	<-ctx.Done()
	logger.Debug("finished discovery loop")
}

func buildPromFile(logger *zap.Logger, env *Cfg, entry *zeroconf.ServiceEntry, strPort string) {
	instance := strings.Replace(entry.Instance, `\ `, " ", -1)

	logger = logger.With(
		zap.String("service", entry.Service),
		zap.String("instance", instance),
		zap.String("hostname", entry.HostName),
	)

	port, err := strconv.Atoi(strPort)
	if err != nil {
		logger.Error("invalid port")
	}

	job := serviceName(entry.Service)

	host := strings.TrimSuffix(entry.HostName, ".")

	var target string
	if env.UseIPS {
		target = fmt.Sprintf("%s:%s", entry.AddrIPv4[0].String(), strPort)
	} else {
		target = fmt.Sprintf("%s:%s", host, strPort)
	}

	cfg := scrapeConfig{
		Targets: []string{
			target,
		},
		Labels: map[string]string{
			"job":  job,
			"host": host,
		},
	}

	filename := strings.Replace(fmt.Sprintf("%s-%s", job, host), ".", "_", -1) + ".yml"
	fn := path.Join(env.OutputDir, filename)

	configs := []*scrapeConfig{&cfg}
	content, err := json.MarshalIndent(configs, "", "  ")

	existing := []byte("")

	logger = logger.With(
		zap.Int("prometheus_port", port),
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

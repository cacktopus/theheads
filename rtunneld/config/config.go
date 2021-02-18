package config

import (
	"time"
)

type Env struct {
	ConfigFile string
}

type Tunnel struct {
	Name                string
	Listen              string
	Gateway             string
	Dial                string
	Keyfile             string
	Healthcheck         string
	HealthcheckInterval time.Duration `yaml:"healthcheck_interval"`
}

type Config struct {
	Stdout  string
	Metrics string
	Tunnels []Tunnel
}

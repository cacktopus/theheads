package config

import (
	"fmt"
	"github.com/hashicorp/consul/api"
)

type Config struct {
	RedisServer string
	CameraName  string
}

func NewClient() *api.Client {
	config := api.DefaultConfig()
	config.Address = "127.0.0.1:8500"
	client, err := api.NewClient(config)
	if err != nil {
		panic(err)
	}
	return client
}

func AllServiceURLs(client *api.Client, serviceName, tag, prefix, postfix string) (result []string, err error) {
	services, _, err := client.Catalog().Service(serviceName, tag, &api.QueryOptions{})
	if err != nil {
		return
	}

	for _, s := range services {
		result = append(result, fmt.Sprintf(
			"%s%s:%d%s",
			prefix,
			s.Address,
			s.ServicePort,
			postfix,
		))
	}

	return
}

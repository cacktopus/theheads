package config

import (
	"fmt"
	"github.com/hashicorp/consul/api"
	"github.com/pkg/errors"
	"gopkg.in/yaml.v2"
)

func NewClient(address string) *api.Client {
	config := api.DefaultConfig()
	config.Address = address
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
		if s.ServiceAddress != "" {
			result = append(result, fmt.Sprintf(
				"%s%s%s",
				prefix, s.ServiceAddress, postfix,
			))
		} else {
			result = append(result, fmt.Sprintf(
				"%s%s:%d%s",
				prefix,
				s.Address,
				s.ServicePort,
				postfix,
			))
		}
	}

	return
}

func MustGetYAML(client *api.Client, path string, result interface{}) {
	resp, _, err := client.KV().Get(path, &api.QueryOptions{})
	if err != nil {
		panic(err)
	}

	if resp == nil {
		panic(errors.New(path + " not found"))
	}

	err = yaml.Unmarshal(resp.Value, result)
	if err != nil {
		panic(err)
	}
}

func GetPrefix(client *api.Client, prefix string) (map[string][]byte, error) {
	resp, _, err := client.KV().List(prefix, &api.QueryOptions{})
	if err != nil {
		return nil, err
	}

	result := map[string][]byte{}
	for _, kv := range resp {
		result[kv.Key] = kv.Value
	}

	return result, nil
}

package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/hashicorp/consul/api"
	"os"
	"strings"
	"text/template"
)

type Config struct {
	Installation string
	RedisServer  string
	CameraName   string
}

func getWithDefault(cfgClient *api.Client, keyTeml string, extra_args map[string]string, defaultValue string) string {
	key, resp, err := getStringInternal(keyTeml, extra_args, cfgClient)
	if err != nil {
		panic(err)
	}

	if resp == nil {
		fmt.Println("No value found for key: " + key)
		return defaultValue
	}

	value := strings.TrimSpace(string(resp.Value))
	return value
}

func mustGetString(cfgClient *api.Client, keyTeml string, extra_args map[string]string) string {
	key, resp, err := getStringInternal(keyTeml, extra_args, cfgClient)
	if err != nil {
		panic(err)
	}

	if resp == nil {
		panic("No value found for key: " + key)
	}

	value := strings.TrimSpace(string(resp.Value))
	return value
}

func getStringInternal(keyTeml string, extra_args map[string]string, cfgClient *api.Client) (string, *api.KVPair, error) {
	hostname, err := os.Hostname()
	if err != nil {
		panic(err)
	}
	tmpl := template.Must(template.New("key template").Parse(keyTeml))
	var key bytes.Buffer
	args := map[string]string{
		"hostname": hostname,
	}
	if extra_args != nil {
		for k, v := range extra_args {
			args[k] = v
		}
	}
	tmpl.Execute(&key, args)
	ctx := context.TODO()
	options := &api.QueryOptions{}
	options = options.WithContext(ctx)
	resp, _, err := cfgClient.KV().Get(key.String(), options)
	return key.String(), resp, err
}

func getCfgClient() (*api.Client, error) {
	client, err := api.NewClient(api.DefaultConfig())

	if err != nil {
		return nil, err
	}

	return client, nil
}

func getConfig() *Config {
	cfgClient, err := getCfgClient()
	if err != nil {
		panic(err)
	}

	var cfg Config
	cfg.Installation = mustGetString(cfgClient, "/the-heads/machines/{{.hostname}}/installation", nil)
	extraArgs := map[string]string{"installation": cfg.Installation}
	cfg.RedisServer = getWithDefault(cfgClient, "/the-heads/installation/{{.installation}}/redis", extraArgs, "127.0.0.1:6379")
	cfg.CameraName = mustGetString(cfgClient, "/the-heads/installation/{{.installation}}/cameras/{{.hostname}}", extraArgs)
	return &cfg

}

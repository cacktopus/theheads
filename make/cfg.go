package main

type Cfg struct {
	SharedFolder string `envconfig:"default=$HOME/shared"`
}

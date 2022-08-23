package metrics_finder

import (
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
)

func Run() {
	env := &Cfg{}

	logger, err := zap.NewProduction()
	if err != nil {
		panic(err)
	}

	err = envconfig.Init(env)
	if err != nil {
		panic(err)
	}

	discoverPrometheus(logger, env)
}

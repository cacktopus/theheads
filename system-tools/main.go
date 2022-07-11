package system_tools

import (
	"github.com/vrischmann/envconfig"
	"go.uber.org/zap"
	"os"
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

	switch os.Args[1] {
	case "discover-prometheus":
		discoverPrometheus(logger, env)
	default:
		panic("unknown action")
	}
}

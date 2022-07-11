package heads_cli

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/common/discovery"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"sort"
	"strings"
)

type DiscoverCmd struct {
}

func (opt *DiscoverCmd) Execute(args []string) error {
	logger, _ := zap.NewProduction()

	discover := discovery.NewSerf("127.0.0.1:7373")
	services, err := discover.Discover(logger)
	if err != nil {
		return errors.Wrap(err, "discover")
	}

	sort.Slice(services, func(i, j int) bool {
		service := strings.Compare(services[i].Service, services[j].Service)
		hostname := strings.Compare(services[i].Hostname, services[j].Hostname)

		switch service {
		case -1:
			return true
		case 0:
			return hostname < 0
		}

		return false
	})

	marshal, err := json.MarshalIndent(services, "", "  ")
	if err != nil {
		return errors.Wrap(err, "marshal json")
	}

	fmt.Println(string(marshal))
	return nil
}

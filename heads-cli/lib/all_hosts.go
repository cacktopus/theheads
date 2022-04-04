package lib

import (
	"fmt"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"regexp"
)

func AllHosts(
	match string,
	callback func(member *client.Member) error,
) error {
	hostMatcher, err := regexp.Compile(match)
	if err != nil {
		return errors.Wrap(err, "compile regex")
	}

	serfClient, err := client.NewRPCClient("127.0.0.1:7373")
	if err != nil {
		return errors.Wrap(err, "connect")
	}

	members, err := serfClient.Members()
	if err != nil {
		return errors.Wrap(err, "members")
	}

	for _, m := range members {
		switch m.Tags["cluster"] {
		case "home", "heads":
		// pass
		default:
			continue
		}

		if !hostMatcher.MatchString(m.Name) {
			fmt.Println(m.Name, "not matched")
			continue
		}

		if m.Status != "alive" {
			fmt.Println(m.Name, "not alive")
			continue
		}

		if err := callback(&m); err != nil {
			return err
		}
	}

	return nil
}

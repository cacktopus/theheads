package serf_service

import (
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"strconv"
	"strings"
)

type SerfService struct {
	Name     string
	Instance string

	Host        string
	ServicePort int
}

func ParseSerfService(logger *zap.Logger, host string, tagKey string, tagVal string) (*SerfService, error) {
	result := &SerfService{
		Host: host,
	}

	{
		parts := strings.Split(tagKey, ":")
		if len(parts) != 2 {
			return nil, errors.New("invalid service name")
		}
		if parts[0] != "s" {
			return nil, errors.New("invalid service name")
		}

		result.Name = parts[1]
	}

	{
		tagVal = strings.TrimSpace(tagVal)
		if len(tagVal) == 0 {
			return result, nil
		}
		pairs := strings.Split(tagVal, " ")
		for _, pair := range pairs {
			parts := strings.Split(pair, ":")
			if len(parts) < 2 {
				return nil, errors.New("invalid pair")
			}
			value := strings.Join(parts[1:], ":")
			tagname := parts[0]
			switch tagname {
			case "sp":
				sp, err := strconv.Atoi(value)
				if err != nil {
					return nil, errors.Wrap(err, "invalid port")
				}
				result.ServicePort = sp
			case "i":
				result.Instance = value
			default:
				logger.Warn("unknown service tag", zap.String("tag", tagname))
			}
		}
	}

	return result, nil
}

func LoadServices(logger *zap.Logger, serfClient *client.RPCClient) ([]*SerfService, error) {
	members, err := serfClient.Members()
	if err != nil {
		return nil, errors.Wrap(err, "members")
	}

	var serfServices []*SerfService
	for _, m := range members {
		for k, v := range m.Tags {
			if !strings.HasPrefix(k, "s:") {
				continue
			}

			srv, err := ParseSerfService(logger, m.Name, k, v)
			if err != nil {
				logger.Warn("error parsing service", zap.Error(err))
				continue
			}

			serfServices = append(serfServices, srv)
		}
	}
	return serfServices, nil
}

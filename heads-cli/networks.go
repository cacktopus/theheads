package heads_cli

import (
	"fmt"
	"github.com/pkg/errors"
	"github.com/ryanuber/go-glob"
	"net"
)

type ipsCommand_ struct {
	Exclude   string `long:"exclude" description:"ip address glob pattern to exclude"`
	Interface string `long:"iface" description:"interface to use" required:"true"`
}

func (s *ipsCommand_) Execute(args []string) error {
	iface, err := findInterface(s.Interface)
	if err != nil {
		return errors.Wrap(err, "find interface")
	}

	return processInterface(iface, s.Exclude)
}

func findInterface(name string) (*net.Interface, error) {
	interfaces, err := net.Interfaces()

	if err != nil {
		return nil, errors.Wrap(err, "interfaces")
	}
	for _, i := range interfaces {
		if i.Name == name {
			return &i, nil
		}
	}
	return nil, errors.New("interface not found")
}

func processInterface(iface *net.Interface, exclude string) error {
	addrs, err := iface.Addrs()
	if err != nil {
		return errors.Wrap(err, "addrs")
	}
	for _, addr := range addrs {
		if addr.Network() != "ip+net" {
			continue
		}
		if exclude != "" {
			fmt.Print()
			if glob.Glob(exclude, addr.String()) {
				continue
			}
		}
		fmt.Println(addr.String())
	}
	return nil
}

var ipsCommand ipsCommand_

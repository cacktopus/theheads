package main

import (
	"crypto/sha256"
	"fmt"
	"github.com/pkg/errors"
)

type assignIPsCommand_ struct {
	Interface string `long:"iface" description:"assignIP to use" required:"true"`
}

func (s *assignIPsCommand_) Execute(args []string) error {
	iface, err := findInterface(s.Interface)
	if err != nil {
		return errors.Wrap(err, "find interface")
	}

	digest := sha256.Sum256(iface.HardwareAddr)
	addr := fmt.Sprintf("%d.%d.%d.%d/16", 10, 2, digest[0], digest[1])
	fmt.Println(addr)

	return nil
}

var assignIPsCommand assignIPsCommand_

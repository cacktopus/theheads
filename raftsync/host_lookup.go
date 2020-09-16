package main

import (
	"fmt"
	"github.com/pkg/errors"
	"net"
	"strings"
	"time"
)

func lookupHost(host string) (string, error) {
	for {
		fmt.Println("looking for", host)
		addrs, err := net.LookupHost(host)

		switch e := err.(type) {
		case nil:
			fmt.Println(host, addrs)
			if len(addrs) != 1 {
				return "", errors.New("too many addresses") // TODO
			}
			return addrs[0], nil
		case *net.DNSError:
			if strings.Contains(e.Error(), "no such host") {
				time.Sleep(time.Second)
				continue
			}
		default:
			return "", errors.Wrap(err, "lookup address for "+host)
		}
	}
}

/*
	hasExistingState, err := raft.HasExistingState(ls, stableStore, snapshotStore)
	if err != nil {
		panic(err)
	}

	var servers []raft.Server
	if !hasExistingState {
		for _, host := range Hosts {
			ip, err := lookupHost(host)
			if err != nil {
				panic(err)
			}
			addr := ip + ":7000"
			servers = append(servers, raft.Server{
				ID:      raft.ServerID(addr),
				Address: raft.ServerAddress(addr),
			})
		}
	}

*/

package server

import (
	"fmt"
	"github.com/pkg/errors"
	"math/rand"
	"os"
	"strings"
)

type node string

type nodes struct {
	selfIdx int
	nodes   []node
}

func newNodes(hosts []string, hostOverride string) *nodes {
	var n []node
	for _, host := range hosts {
		n = append(n, node(host))
	}

	result := &nodes{
		nodes:   n,
		selfIdx: -1,
	}

	err := result.whoami(hostOverride)
	if err != nil {
		panic(err)
	}

	return result
}

func (s *nodes) whoami(hostOverride string) error {
	hostname, err := os.Hostname()
	if err != nil {
		return errors.Wrap(err, "hostname")
	}

	for i, n := range s.nodes {
		domainName := string(n)
		// Perhaps IP address matches exactly
		if hostOverride != "" && domainName == hostOverride {
			s.selfIdx = i
			return nil
		}

		host := strings.Split(domainName, ".")[0]
		if host == hostname {
			s.selfIdx = i
			return nil
		}
	}

	return errors.New("unable to determine whoami")
}

func (s *nodes) otherNodes() nodes {
	var others []node
	for pos, other := range s.nodes {
		if s.selfIdx == pos {
			continue
		}
		others = append(others, other)
	}

	rand.Shuffle(len(others), func(i, j int) {
		tmp := others[i]
		others[i] = others[j]
		others[j] = tmp
	})

	return nodes{nodes: others}
}

func (s *nodes) me() node {
	return s.nodes[s.selfIdx]
}

func (s node) httpAddr() string {
	return fmt.Sprintf("%s:%d", string(s), httpAddr)
}

func (s node) rpcAddr() string {
	return fmt.Sprintf("%s:%d", string(s), rpcAddr)
}

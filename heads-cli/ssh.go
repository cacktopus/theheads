package heads_cli

import (
	"fmt"
	"github.com/cacktopus/theheads/heads-cli/lib"
	"github.com/hashicorp/serf/client"
	"github.com/pkg/errors"
	"golang.org/x/crypto/ssh"
	"golang.org/x/crypto/ssh/agent"
	"net"
	"os"
	"strings"
	gosync "sync"
	"time"
)

type allCommand struct {
	Match string `long:"match" description:"host pattern to match" default:"."`
	User  string `short:"u" description:"user" default:"pi"`
}

func (s *allCommand) Execute(args []string) error {
	return all(s, args)
}

func SSHAgent() ssh.AuthMethod {
	if sshAgent, err := net.Dial("unix", os.Getenv("SSH_AUTH_SOCK")); err == nil {
		return ssh.PublicKeysCallback(agent.NewClient(sshAgent).Signers)
	}
	return nil
}

func all(opt *allCommand, args []string) error {
	agent := SSHAgent()
	if len(args) == 0 {
		return errors.New("no command given")
	}

	var wg gosync.WaitGroup
	errCh := make(chan error)

	if err := lib.AllHosts(opt.Match, func(m *client.Member) error {
		wg.Add(1)
		go func(m client.Member) {
			errCh <- sshRun(opt, agent, ssh.InsecureIgnoreHostKey(), m, args)
		}(*m)
		return nil
	}); err != nil {
		return errors.Wrap(err, "allhosts")
	}

	result := make(chan error)

	go func() {
		for err := range errCh {
			if err != nil {
				result <- err
				return
			} else {
				wg.Done()
			}
		}
	}()

	go func() {
		wg.Wait()
		result <- nil
	}()

	return <-result
}

func sshRun(opt *allCommand, agent ssh.AuthMethod, knownHosts ssh.HostKeyCallback, m client.Member, args []string) error {
	fmt.Println("ssh", m.Addr, m.Name)
	cfg := &ssh.ClientConfig{
		User:            opt.User,
		Auth:            []ssh.AuthMethod{agent},
		HostKeyCallback: knownHosts,
		Timeout:         10 * time.Second,
	}

	addr := fmt.Sprintf("%s:22", m.Addr.String())
	conn, err := ssh.Dial("tcp", addr, cfg)
	if err != nil {
		return fmt.Errorf("dial %s: %w", m.Name, err)
	}

	fmt.Println("connected to", addr, m.Name)

	session, err := conn.NewSession()
	if err != nil {
		return err
	}

	output, err := session.CombinedOutput(strings.Join(args, " "))
	if err != nil {
		return err
	}

	fmt.Println(m.Name, m.Addr, strings.TrimSpace(string(output)))

	return nil
}

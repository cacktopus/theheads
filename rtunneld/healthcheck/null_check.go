package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/ssh"
)

func NullCheck(tunnel *config.Tunnel, sshConfig *ssh.ClientConfig, iLog *log.Entry) error {
	return nil
}

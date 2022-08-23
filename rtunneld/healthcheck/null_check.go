package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	"go.uber.org/zap"
	"golang.org/x/crypto/ssh"
)

func NullCheck(
	logger *zap.Logger,
	tunnel *config.Tunnel,
	sshConfig *ssh.ClientConfig,
) error {
	return nil
}

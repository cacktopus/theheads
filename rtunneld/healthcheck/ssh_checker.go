package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	"go.uber.org/zap"
	"golang.org/x/crypto/ssh"
	"strings"
	"time"
)

type SshChecker struct{}

func (c *SshChecker) Check(
	logger *zap.Logger,
	tunnel *config.Tunnel,
	sshConfig *ssh.ClientConfig,
) error {
	logger.Info("dialing")

	// TODO: timeout here
	if sshConfig.Timeout == 0 {
		panic("Timeout is zero")
	}

	jumpClient, err := ssh.Dial("tcp", tunnel.Gateway, sshConfig)
	if err != nil {
		logger.Error("connection to gateway failed", zap.Error(err))
		return err
	}
	go func() {
		// yuck
		time.Sleep(30 * time.Second)
		jumpClient.Close()
	}()

	conn, err := jumpClient.Dial("tcp", tunnel.Listen) // TODO: timeout?
	if err != nil {
		logger.Error("dial failed", zap.Error(err))
		return err
	}
	go func() {
		// yuck
		time.Sleep(30 * time.Second)
		conn.Close()
	}()

	logger.Debug("connected")
	logger.Debug("reading")

	buf := make([]byte, 100)

	nr, err := conn.Read(buf) // TODO: timeout
	if err != nil {
		logger.Error("read failed", zap.Error(err))
		return err
	}

	body := strings.TrimRight(string(buf[:nr]), "\r\n")
	logger.Info("body", zap.String("body", body))

	return nil
}

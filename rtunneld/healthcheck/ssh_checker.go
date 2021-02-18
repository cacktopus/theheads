package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/ssh"
	"strings"
	"time"
)

type SshChecker struct{}

func (c *SshChecker) Check(tunnel *config.Tunnel, sshConfig *ssh.ClientConfig, iLog *log.Entry) error {
	iLog.Print("dialing")

	// TODO: timeout here
	if sshConfig.Timeout == 0 {
		panic("Timeout is zero")
	}

	jumpClient, err := ssh.Dial("tcp", tunnel.Gateway, sshConfig)
	if err != nil {
		iLog.WithError(err).Error("connection to gateway failed")
		return err
	}
	go func() {
		// yuck
		time.Sleep(30 * time.Second)
		jumpClient.Close()
	}()

	conn, err := jumpClient.Dial("tcp", tunnel.Listen) // TODO: timeout?
	if err != nil {
		iLog.WithError(err).Error("dial failed")
		return err
	}
	go func() {
		// yuck
		time.Sleep(30 * time.Second)
		conn.Close()
	}()

	iLog.Print("connected")
	iLog.Print("reading")

	buf := make([]byte, 100)

	nr, err := conn.Read(buf) // TODO: timeout
	if err != nil {
		iLog.WithError(err).Error("read failed")
		return err
	}

	body := strings.TrimRight(string(buf[:nr]), "\r\n")
	iLog.WithField("body", body).Print("read")

	return nil
}

package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	"go.uber.org/zap"
	"golang.org/x/crypto/ssh"
	"io/ioutil"
	"net/http"
	"time"
)

type HttpChecker struct {
	URL string
}

func (c *HttpChecker) Check(
	logger *zap.Logger,
	tunnel *config.Tunnel,
	sshConfig *ssh.ClientConfig,
) error {
	logger.Info("dialing")

	// TODO: timeout here
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

	httpClient := http.Client{
		Transport: &http.Transport{
			Dial: jumpClient.Dial,
		},
	}

	resp, err := httpClient.Get(c.URL)
	if err != nil {
		return err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	logger.Debug("body", zap.String("body", string(body)))

	return nil
}

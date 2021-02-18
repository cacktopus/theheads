package healthcheck

import (
	"github.com/cacktopus/theheads/rtunneld/config"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/ssh"
	"io/ioutil"
	"net/http"
	"time"
)

type HttpChecker struct {
	URL string
}

func (c *HttpChecker) Check(tunnel *config.Tunnel, sshConfig *ssh.ClientConfig, iLog *log.Entry) error {
	iLog.Print("dialing")

	// TODO: timeout here
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

	iLog.WithField("body", string(body)).Print("body")

	return nil
}

package deploy

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
	ogórek "github.com/kisielk/og-rek"
	"golang.org/x/crypto/ssh"
	"golang.org/x/crypto/ssh/agent"
	"io/ioutil"
	"net"
	"os"
	"time"
)

func SSHAgent() ssh.AuthMethod {
	if sshAgent, err := net.Dial("unix", os.Getenv("SSH_AUTH_SOCK")); err == nil {
		return ssh.PublicKeysCallback(agent.NewClient(sshAgent).Signers)
	}
	return nil
}

type jumpCfg struct {
	user string
	addr string
}

func newCfg(authMethod ssh.AuthMethod, user string) *ssh.ClientConfig {
	return &ssh.ClientConfig{
		User:            user,
		Auth:            []ssh.AuthMethod{authMethod},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         10 * time.Second,
	}
}

func connect(authMethod ssh.AuthMethod, jc []*jumpCfg) *ssh.Client {
	jump, rest := jc[0], jc[1:]

	sshClient, err := ssh.Dial("tcp", jump.addr, newCfg(authMethod, jump.user))
	noError(err)
	fmt.Printf("connected to %s@%s\n", jump.user, jump.addr)

	if len(rest) == 0 {
		return sshClient
	}

	return proxyJump(authMethod, sshClient, rest)
}

func proxyJump(authMethod ssh.AuthMethod, client *ssh.Client, jc []*jumpCfg) *ssh.Client {
	jump, rest := jc[0], jc[1:]

	jumpConn, err := client.Dial("tcp4", jump.addr)
	noError(err)

	ncc, channels, reqs, err := ssh.NewClientConn(jumpConn, jump.addr, newCfg(authMethod, jump.user))
	noError(err)
	fmt.Printf("connected to %s@%s\n", jump.user, jump.addr)

	newClient := ssh.NewClient(ncc, channels, reqs)

	if len(rest) == 0 {
		return newClient
	}

	return proxyJump(authMethod, newClient, rest)
}

func deploy() {
	agent := SSHAgent()

	client := connect(agent, []*jumpCfg{
		{
			user: "pi",
			addr: "pi40:22",
		},
		{
			user: "root",
			addr: "192.168.1.1:22",
		},
		{
			user: "pi",
			addr: "base01:22",
		},
	})

	session, err := client.NewSession()
	noError(err)

	content, err := ioutil.ReadFile(os.ExpandEnv("$HOME/shared/builds/arm64/boss_0.31.0_arm64.tar.gz"))
	noError(err)

	hash := sha256.Sum256(content)

	steps := []map[interface{}]interface{}{
		newStep("build", "get_tar_archive", map[string]interface{}{
			"app_name":        "boss",
			"url":             "file:///home/static/shared/builds/" + "arm64/boss_0.31.0_arm64.tar.gz",
			"digest":          hex.EncodeToString(hash[:]),
			"allowed_digests": []string{},
			"public_keys":     []string{"RWSAyCAEiaBY/tMpLQ94VyT5oDWgsf8lgdexbDQ+QOBtECC7mtGPapNP"},
		}),
		newStep("root", "systemctl_restart_if_running", map[string]interface{}{
			"service_name": "boss",
		}),
	}

	buf := bytes.NewBuffer(nil)
	encoder := ogórek.NewEncoder(buf)
	err = encoder.Encode(steps)

	cmd := base64.StdEncoding.EncodeToString(buf.Bytes())

	output, err := session.CombinedOutput("sudo python3 remote_scripts.pyz stdin-rpc " + cmd)
	fmt.Println(string(output))
	noError(err)
}

func newStep(
	user string,
	method string,
	params map[string]interface{},
) map[interface{}]interface{} {
	paramsEnc := map[interface{}]interface{}{}
	for k, v := range params {
		paramsEnc[k] = v
	}

	return map[interface{}]interface{}{
		"user": user,
		"payload": map[interface{}]interface{}{
			"method": method,
			"params": params,
		},
	}
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

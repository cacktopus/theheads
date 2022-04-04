package systemd_analyze

import (
	"os/exec"
	"sync"
)

var once sync.Once
var err error
var output []byte

func Plot() ([]byte, error) {
	once.Do(func() {
		cmd := exec.Command("systemd-analyze", "plot")
		output, err = cmd.CombinedOutput()
	})
	if err != nil {
		return nil, err
	}
	return output, nil
}

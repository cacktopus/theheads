package floodlight

import (
	"fmt"
	"github.com/cacktopus/theheads/common/util"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"io/ioutil"
	"path/filepath"
	"sync"
)

const (
	gpioDir = "/sys/class/gpio"
)

type Floodlight struct {
	pin   int
	lock  sync.Mutex
	value string
	gauge prometheus.Gauge
}

func NewFloodlight(pin int) *Floodlight {
	return &Floodlight{pin: pin}
}

func (fl *Floodlight) Setup() error {
	export := filepath.Join(gpioDir, "export")

	pinDir := filepath.Join(
		gpioDir,
		fmt.Sprintf("gpio%d", fl.pin),
	)

	direction := filepath.Join(pinDir, "direction")
	fl.value = filepath.Join(pinDir, "value")

	if !util.Exists(pinDir) {
		if err := ioutil.WriteFile(export, []byte(fmt.Sprintf("%d\n", fl.pin)), 0o770); err != nil {
			return errors.Wrap(err, "export")
		}
	}

	if err := ioutil.WriteFile(direction, []byte("out\n"), 0o770); err != nil {
		return errors.Wrap(err, "direction")
	}

	return nil
}

func (fl *Floodlight) On() error {
	return errors.Wrap(ioutil.WriteFile(fl.value, []byte("1\n"), 0o770), "value")
}

func (fl *Floodlight) Off() error {
	return errors.Wrap(ioutil.WriteFile(fl.value, []byte("0\n"), 0o770), "value")
}

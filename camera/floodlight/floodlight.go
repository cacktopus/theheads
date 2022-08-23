package floodlight

import (
	"fmt"
	"github.com/cacktopus/theheads/common/util"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"io/ioutil"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
)

const (
	gpioDir = "/sys/class/gpio"
)

type Floodlight struct {
	pin       int
	lock      sync.Mutex
	valuePath string
	gauge     prometheus.Gauge

	once       sync.Once
	setupError error
}

func NewFloodlight(pin int) *Floodlight {
	return &Floodlight{pin: pin}
}

func (fl *Floodlight) Setup() error {
	fl.once.Do(func() {
		fl.setupError = fl.setup()
	})
	return fl.setupError
}

func (fl *Floodlight) setup() error {
	export := filepath.Join(gpioDir, "export")

	pinDir := filepath.Join(
		gpioDir,
		fmt.Sprintf("gpio%d", fl.pin),
	)

	direction := filepath.Join(pinDir, "direction")
	fl.valuePath = filepath.Join(pinDir, "value")

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
	if err := fl.Setup(); err != nil {
		return err
	}

	fl.lock.Lock()
	defer fl.lock.Unlock()

	return errors.Wrap(ioutil.WriteFile(fl.valuePath, []byte("1\n"), 0o770), "value")
}

func (fl *Floodlight) Off() error {
	if err := fl.Setup(); err != nil {
		return err
	}

	fl.lock.Lock()
	defer fl.lock.Unlock()

	return errors.Wrap(ioutil.WriteFile(fl.valuePath, []byte("0\n"), 0o770), "value")
}

func (fl *Floodlight) Value() (bool, error) {
	if err := fl.Setup(); err != nil {
		return false, err
	}

	fl.lock.Lock()
	defer fl.lock.Unlock()

	content, err := ioutil.ReadFile(fl.valuePath)
	if err != nil {
		return false, errors.Wrap(err, "read file")
	}

	value, err := strconv.Atoi(strings.TrimSpace(string(content)))
	if err != nil {
		return false, errors.Wrap(err, "convert to int")
	}

	return value != 0, nil
}

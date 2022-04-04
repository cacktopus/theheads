
package gpio_sensor

import (
	"fmt"
	"github.com/cacktopus/theheads/common/util"
	"github.com/pkg/errors"
	"io/ioutil"
	"path/filepath"
	"strconv"
	"strings"
)

const (
	gpioDir = "/sys/class/gpio"
)

type Sensor struct {
	pin       int
	pinDir    string
	direction string
	value     string
}

func New(pin int) *Sensor {
	pinDir := filepath.Join(
		gpioDir,
		fmt.Sprintf("gpio%d", pin),
	)

	s := &Sensor{
		pin:       pin,
		pinDir:    pinDir,
		direction: filepath.Join(pinDir, "direction"),
		value:     filepath.Join(pinDir, "value"),
	}

	return s
}

func Initialize(s *Sensor) error {
	export := filepath.Join(gpioDir, "export")
	if !util.Exists(s.pinDir) {
		err := ioutil.WriteFile(export, []byte(fmt.Sprintf("%d\n", s.pin)), 0o770)
		if err != nil {
			return errors.Wrap(err, "export")
		}
	}

	err := ioutil.WriteFile(s.direction, []byte("in\n"), 0o770)
	if err != nil {
		return errors.Wrap(err, "direction")
	}

	return nil
}

func (s *Sensor) Read() (bool, error) {
	content, err := ioutil.ReadFile(s.value)
	if err != nil {
		return false, errors.Wrap(err, "read file")
	}

	i, err := strconv.Atoi(strings.TrimSpace(string(content)))
	if err != nil {
		return false, errors.Wrap(err, "convert int")
	}

	result := i == 0 // active low
	return result, nil
}

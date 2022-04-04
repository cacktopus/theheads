package magnetometer

import "github.com/pkg/errors"

type NullSensor struct {
}

func (n NullSensor) HasHardware() bool {
	return false
}

func (n NullSensor) Read() (*Reading, error) {
	return nil, errors.New("no hardware for reading")
}

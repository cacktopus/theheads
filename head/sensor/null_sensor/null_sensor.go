package null_sensor

type Sensor struct {
}

func (s Sensor) Read() (bool, error) {
	return false, nil
}

package sensor

type Sensor interface {
	Read() (bool, error)
}

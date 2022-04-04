package ds3231

func (d *Device) ReadRegister(address byte, data []byte) error {
	return d.dev.Tx([]byte{address}, data)
}

func (d *Device) WriteRegister(address byte, data []byte) error {
	write := append([]byte{address}, data...)
	return d.dev.Tx(write, nil)
}

package h264

import (
	"bufio"
	"errors"
	"io"
)

var ErrMaxBufsize = errors.New("max buffer size exceeded")

const maxBufSize = 2 * 1024 * 1024

// Split is a non-compliant h264 NALU parser. It will only parse certain files (e.g, those produced by raspivid)
// correctly
func Split(r io.Reader, callback func([]byte) error) error {
	var buf []byte

	r2 := bufio.NewReaderSize(r, 1024*64)

	for {
		read, err := r2.ReadBytes(byte(0))
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}

		peek, err := r2.Peek(3)
		if err != nil {
			return err
		}

		if peek[0] == 0 && peek[1] == 0 && peek[2] == 1 {
			buf = append(buf, read[0:len(read)-1]...)
			_, err := r2.Discard(3)
			if err != nil {
				return err
			}
			if len(buf) > 0 {
				if err := callback(buf); err != nil {
					return err
				}
			} else if len(buf) > maxBufSize {
				return ErrMaxBufsize
			}
			buf = nil
		} else {
			buf = append(buf, read...)
		}
	}
}

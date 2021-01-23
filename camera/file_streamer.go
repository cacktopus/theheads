package camera

import (
	"io"
	"os"
	"time"
)

func runFileStreamer(filename string) (chan []byte, error) {
	frames := make(chan []byte)

	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}

	go func() {
		frame0 := make([]byte, width*height)
		frame1 := make([]byte, width*height)
		for {
			f.Close()
			f, err := os.Open(filename)
			if err != nil {
				panic(err)
			}

			for {
				_, err := io.ReadFull(f, frame0)
				if err == io.EOF {
					break
				}
				if err != nil {
					panic(err)
				}
				frames <- frame0

				time.Sleep(time.Second / rate)

				_, err = io.ReadFull(f, frame1)
				if err == io.EOF {
					break
				}

				if err != nil {
					panic(err)
				}
				frames <- frame1

				time.Sleep(time.Second / rate)
			}
		}
	}()

	return frames, nil
}

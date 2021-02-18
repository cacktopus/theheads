package camera

import (
	"io"
	"os"
	"time"
)

func runFileStreamer(filename string, width, height, framerate int) (chan []byte, error) {
	frames := make(chan []byte)

	f, err := os.Open(filename)
	if err != nil {
		return nil, err
	}

	pause := time.Duration(int(time.Second) / framerate)

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

				time.Sleep(pause)

				_, err = io.ReadFull(f, frame1)
				if err == io.EOF {
					break
				}

				if err != nil {
					panic(err)
				}
				frames <- frame1

				time.Sleep(pause)
			}
		}
	}()

	return frames, nil
}

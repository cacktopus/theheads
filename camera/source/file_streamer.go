package source

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"io"
	"os"
	"time"
)

type FileStreamer struct {
	logger   *zap.Logger
	env      *cfg.Cfg
	filename string
	frames   chan []byte
}

func (s *FileStreamer) Grab(dst *gocv.Mat) error {
	frame := <-s.frames

	input, err := gocv.NewMatFromBytes(s.env.Height, s.env.Width, gocv.MatTypeCV8U, frame)
	if err != nil {
		return errors.Wrap(err, "new mat from bytes")
	}
	defer input.Close()
	input.CopyTo(dst)

	return nil
}

func NewFileStreamer(logger *zap.Logger, env *cfg.Cfg, filename string) *FileStreamer {
	fs := &FileStreamer{
		logger:   logger,
		env:      env,
		filename: filename,
	}

	go fs.runFileStreamer()

	return fs
}

func (s *FileStreamer) runFileStreamer() {
	s.frames = make(chan []byte)

	f, err := os.Open(s.filename)
	if err != nil {
		panic(err)
	}

	pause := time.Duration(int(time.Second) / s.env.Framerate)

	go func() {
		frame0 := make([]byte, s.env.Width*s.env.Height)
		frame1 := make([]byte, s.env.Width*s.env.Height)
		for {
			f.Close()
			f, err := os.Open(s.filename)
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
				s.frames <- frame0

				time.Sleep(pause)

				_, err = io.ReadFull(f, frame1)
				if err == io.EOF {
					break
				}

				if err != nil {
					panic(err)
				}
				s.frames <- frame1

				time.Sleep(pause)
			}
		}
	}()
}

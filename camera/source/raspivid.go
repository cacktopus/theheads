package source

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"io"
	"os/exec"
	"strings"
)

type Raspivid struct {
	logger *zap.Logger
	env    *cfg.Cfg
	frames chan []byte
}

func NewRaspivid(
	logger *zap.Logger,
	env *cfg.Cfg,
) (*Raspivid, error) {
	r := &Raspivid{
		logger: logger,
		env:    env,
		frames: make(chan []byte),
	}

	err := r.runRaspiVid()
	if err != nil {
		return nil, errors.Wrap(err, "run raspivid")
	}

	return r, nil
}

func (r *Raspivid) Grab(dst *gocv.Mat) error {
	frame := <-r.frames

	input, err := gocv.NewMatFromBytes(r.env.Height, r.env.Width, gocv.MatTypeCV8U, frame)
	if err != nil {
		return errors.Wrap(err, "new mat from bytes")
	}
	defer input.Close()
	input.CopyTo(dst)

	return nil
}

func (r *Raspivid) runRaspiVid() error {
	var extraArgs []string
	extraArgs = append(extraArgs, r.env.RaspividExtraArgs...)

	if r.env.Hflip {
		extraArgs = append(extraArgs, "-hf")
	}
	if r.env.Vflip {
		extraArgs = append(extraArgs, "-vf")
	}

	raspivid, err := exec.LookPath("raspivid")
	if err != nil {
		return errors.Wrap(err, "lookpath")
	}

	args := []string{
		raspivid,
		"-n",
		"-fps", fmt.Sprintf("%d", r.env.Framerate),
		"-t", "0",
		"-w", fmt.Sprintf("%d", r.env.Width),
		"-h", fmt.Sprintf("%d", r.env.Height),
		"--raw", "-",
		"-rf", "gray",
		"-o", "/dev/null",
	}
	args = append(args, extraArgs...)

	r.logger.Info("running raspivid", zap.String("cmd", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return errors.Wrap(err, "stdoutpipe")
	}

	go func() {
		frame0 := make([]byte, r.env.Width*r.env.Height)
		frame1 := make([]byte, r.env.Width*r.env.Height)
		for {
			_, err := io.ReadFull(stdout, frame0)
			if err != nil {
				panic(err)
			}
			r.frames <- frame0

			io.ReadFull(stdout, frame1)
			if err != nil {
				panic(err)
			}
			r.frames <- frame1
		}
	}()

	err = cmd.Start()
	if err != nil {
		return errors.Wrap(err, "start")
	}

	return nil
}

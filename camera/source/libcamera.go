package source

import (
	"bufio"
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"io"
	"os/exec"
	"strings"
)

type Libcamera struct {
	logger *zap.Logger
	env    *cfg.Cfg
	frames chan []byte
}

func NewLibcamera(
	logger *zap.Logger,
	env *cfg.Cfg,
) (*Libcamera, error) {
	lc := &Libcamera{
		logger: logger,
		env:    env,
		frames: make(chan []byte),
	}

	err := lc.run()
	if err != nil {
		return nil, errors.Wrap(err, "run libcamera")
	}

	return lc, nil
}

func (lc *Libcamera) Grab(dst *gocv.Mat) error {
	frame := <-lc.frames

	input, err := gocv.NewMatFromBytes(lc.env.Height, lc.env.Width, gocv.MatTypeCV8U, frame)
	if err != nil {
		return errors.Wrap(err, "new mat from bytes")
	}
	defer input.Close()
	input.CopyTo(dst)

	return nil
}

func (lc *Libcamera) run() error {
	var extraArgs []string
	extraArgs = append(extraArgs, lc.env.RaspividExtraArgs...) // TODO: env name?

	if lc.env.Hflip {
		extraArgs = append(extraArgs, "--hflip")
	}
	if lc.env.Vflip {
		extraArgs = append(extraArgs, "--vflip")
	}

	libcamera, err := exec.LookPath("libcamera-vid")
	if err != nil {
		return errors.Wrap(err, "lookpath")
	}

	args := []string{
		libcamera,
		"-v0",
		//"--saturation", "0",
		"--codec", "yuv420",
		"--framerate", fmt.Sprintf("%d", lc.env.Framerate),
		"-t", "0",
		"--width", fmt.Sprintf("%d", lc.env.Width),
		"--height", fmt.Sprintf("%d", lc.env.Height),
		"-o", "-",
	}
	args = append(args, extraArgs...)

	lc.logger.Info("running libcamera", zap.String("cmd", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return errors.Wrap(err, "stdoutpipe")
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return errors.Wrap(err, "stderrpipe")
	}

	go func() {
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			lc.logger.Info("libcamera stderr", zap.String("line", scanner.Text()))
		}
	}()

	go func() {
		frame0 := make([]byte, lc.env.Width*lc.env.Height*6/4)
		frame1 := make([]byte, lc.env.Width*lc.env.Height*6/4)

		for {
			_, err := io.ReadFull(stdout, frame0)
			if err != nil {
				lc.logger.Info("readfull failed", zap.Error(err))
				return
			}
			lc.frames <- frame0

			_, err = io.ReadFull(stdout, frame1)
			if err != nil {
				lc.logger.Info("readfull failed", zap.Error(err))
				return
			}
			lc.frames <- frame1
		}
	}()

	err = cmd.Start()
	if err != nil {
		return errors.Wrap(err, "start")
	}

	return nil
}

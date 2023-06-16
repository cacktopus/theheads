package raspivid_recorder

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

type RaspividRecorder struct {
	logger *zap.Logger
	env    *cfg.Cfg
	*raspiRecoder
	frames chan []byte
}

func NewRaspividRecorder(
	logger *zap.Logger,
	env *cfg.Cfg,
) (*RaspividRecorder, error) {
	r := &RaspividRecorder{
		logger:       logger,
		env:          env,
		raspiRecoder: newRecorder(env.RecorderBufsize),
		frames:       make(chan []byte),
	}

	err := r.runRaspiVid()
	if err != nil {
		return nil, errors.Wrap(err, "run raspivid")
	}

	return r, nil
}

func (r *RaspividRecorder) Grab(dst *gocv.Mat) error {
	frame := <-r.frames

	input, err := gocv.NewMatFromBytes(r.env.Height, r.env.Width, gocv.MatTypeCV8U, frame)
	if err != nil {
		return errors.Wrap(err, "new mat from bytes")
	}
	defer input.Close()
	input.CopyTo(dst)

	return nil
}

func (r *RaspividRecorder) runRaspiVid() error {
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

	dir, err := ioutil.TempDir("", "")
	if err != nil {
		return errors.Wrap(err, "tmpdir")
	}

	fifo := filepath.Join(dir, "fifo")

	err = syscall.Mkfifo(fifo, 0o600)
	if err != nil {
		return errors.Wrap(err, "mkfifo")
	}

	go func() {
		file, err := os.OpenFile(fifo, os.O_RDONLY, 0o600)
		if err != nil {
			panic(err)
		}

		if err := r.raspiRecoder.Run(file); err != nil {
			r.logger.Error("h264 splitter exited")
			panic(err)
		}
	}()

	args := []string{
		raspivid,
		"-n",
		"-fps", fmt.Sprintf("%d", r.env.Framerate),
		"-t", "0",
		"-w", fmt.Sprintf("%d", r.env.Width),
		"-h", fmt.Sprintf("%d", r.env.Height),
		"--raw", "-",
		"-rf", "gray",
		"-o", fifo,
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

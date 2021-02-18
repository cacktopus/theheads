package camera

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/recorder"
	"go.uber.org/zap"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"os/user"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func raspiStill(logger *zap.Logger) error {
	usr, err := user.Current()
	if err != nil {
		return err
	}

	outdir := filepath.Join(usr.HomeDir, "photos")
	err = os.MkdirAll(outdir, 0750)

	filename := fmt.Sprintf("%d.jpg", time.Now().UnixNano())

	out := filepath.Join(outdir, filename)

	raspivid, err := exec.LookPath("raspistill")
	if err != nil {
		return err
	}

	args := []string{
		raspivid,
		"-vf",
		"-o", out,
	}

	logger.Info("running raspistill", zap.String("cmd", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)
	err = cmd.Start()
	if err != nil {
		return err
	}

	err = cmd.Wait()
	if err != nil {
		return err
	}

	return nil
}

func runRaspiVid(
	logger *zap.Logger,
	rec *recorder.Recorder,
	width, height, framerate int,
	extraArgs ...string,
) (chan []byte, error) {
	frames := make(chan []byte)

	raspivid, err := exec.LookPath("raspivid")
	if err != nil {
		return nil, err
	}

	dir, err := ioutil.TempDir("", "")
	if err != nil {
		panic(err)
	}

	fifo := filepath.Join(dir, "fifo")

	err = syscall.Mkfifo(fifo, 0o600)
	if err != nil {
		panic(err)
	}

	go func() {
		file, err := os.OpenFile(fifo, os.O_RDONLY, 0o600)
		if err != nil {
			panic(err)
		}

		if err := rec.Run(file); err != nil {
			logger.Error("h264 splitter exited")
			panic(err)
		}
	}()

	args := []string{
		raspivid,
		"-n",
		"-fps", fmt.Sprintf("%d", framerate),
		"-t", "0",
		"-w", fmt.Sprintf("%d", width),
		"-h", fmt.Sprintf("%d", height),
		"--raw", "-",
		"-rf", "gray",
		"-o", fifo,
	}
	args = append(args, extraArgs...)

	logger.Info("running raspivid", zap.String("cmd", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}

	go func() {
		frame0 := make([]byte, width*height)
		frame1 := make([]byte, width*height)
		for {
			_, err := io.ReadFull(stdout, frame0)
			if err != nil {
				panic(err)
			}
			frames <- frame0

			io.ReadFull(stdout, frame1)
			if err != nil {
				panic(err)
			}
			frames <- frame1
		}
	}()

	err = cmd.Start()
	if err != nil {
		panic(err)
	}

	return frames, nil
}

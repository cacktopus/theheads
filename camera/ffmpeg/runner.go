package ffmpeg

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"io"
	"io/ioutil"
	"os/exec"
	"runtime"
)

func (ff *Ffmpeg) spawnFfmpeg(width, height int) (io.Writer, io.Reader) {
	ffmpeg, err := exec.LookPath("ffmpeg")
	if err != nil {
		panic(err)
	}

	cmd := exec.Command(ffmpeg,
		"-f", "rawvideo",
		"-pix_fmt", "bgr24",
		//"-pix_fmt", "gray",
		"-s", fmt.Sprintf("%dx%d", width, height),
		"-r", fmt.Sprintf("%d", ff.env.Framerate),
		"-i", "-",
		"-f", "mpegts",
		"-b:v", fmt.Sprintf("%dk", ff.env.BitrateKB),
		"-codec:v", "mpeg1video",
		"-",
	)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		panic(err)
	}

	go func() {
		io.Copy(ioutil.Discard, stderr)
	}()

	stdin, err := cmd.StdinPipe()
	if err != nil {
		panic(err)
	}

	go func() {
		ff.logger.Info("running ffmpeg")
		err := cmd.Start()
		if err != nil {
			panic(err)
		}

		if runtime.GOOS == "linux" {
			// TODO: this will cause panics if ffmpeg crashes
			promauto.With(ff.registry).NewCounterFunc(prometheus.CounterOpts{
				//TODO: use tags instead of separate metric names
				Name: "heads_camera_ffmpeg_cpu_user_jiffies",
			}, func() float64 {
				return cpumon.ParseProc(cmd.Process.Pid, 13)
			})

			promauto.With(ff.registry).NewCounterFunc(prometheus.CounterOpts{
				Name: "heads_camera_ffmpeg_cpu_system_jiffies",
			}, func() float64 {
				return cpumon.ParseProc(cmd.Process.Pid, 14)
			})
		}

		cmd.Wait()
		ff.logger.Info("exited ffmpeg")
	}()

	return stdin, stdout
}

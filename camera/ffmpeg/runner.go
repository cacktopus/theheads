package ffmpeg

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/cpumon"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"io"
	"io/ioutil"
	"os/exec"
	"runtime"
	"sync"
	"time"
)

func spawnFfmpeg(logger *zap.Logger, width, height int, bitrate int, framerate int) (
	io.Writer, // TODO: WriteCloser
	io.Reader, // TODO: ReadCloser
) {
	//var stdout bytes.Buffer
	//var stderr bytes.Buffer
	ffmpeg, err := exec.LookPath("ffmpeg")
	if err != nil {
		panic(err)
	}

	cmd := exec.Command(ffmpeg,
		"-f", "rawvideo",
		//"-pix_fmt", "bgr24",
		"-pix_fmt", "gray",
		"-s", fmt.Sprintf("%dx%d", width, height),
		"-r", fmt.Sprintf("%d", framerate),
		"-i", "-",
		"-f", "mpegts",
		"-b:v", fmt.Sprintf("%dk", bitrate),
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
		logger.Info("running ffmpeg")
		err := cmd.Start()
		if err != nil {
			panic(err)
		}

		if runtime.GOOS == "linux" {
			// TODO: this will cause panics if ffmpeg crashes
			promauto.NewCounterFunc(prometheus.CounterOpts{
				//TODO: use tags instead of separate metric names
				Name: "heads_camera_ffmpeg_cpu_user_jiffies",
			}, func() float64 {
				return cpumon.ParseProc(cmd.Process.Pid, 13)
			})

			promauto.NewCounterFunc(prometheus.CounterOpts{
				Name: "heads_camera_ffmpeg_cpu_system_jiffies",
			}, func() float64 {
				return cpumon.ParseProc(cmd.Process.Pid, 14)
			})
		}

		cmd.Wait()
		logger.Info("exited ffmpeg")
	}()

	return stdin, stdout
}

func runFfmpeg(logger *zap.Logger, b *broker.Broker, bitrate, framerate int) chan gocv.Mat {
	ffmpegFeeder := make(chan gocv.Mat)

	publisher := func(ffStdout io.Reader) {
		buf := make([]byte, 1024*64)
		for {
			nread, err := ffStdout.Read(buf)

			b.Publish(&Buffer{
				Data: buf[:nread],
			})

			if err != nil {
				time.Sleep(1 * time.Second)
				panic(err)
			}
		}
	}

	go func() {
		var once sync.Once
		var ffStdin io.Writer
		var ffStdout io.Reader

		for {
			mat := <-ffmpegFeeder

			once.Do(func() {
				size := mat.Size()
				height := size[0]
				width := size[1]
				logger.Info("spawning ffmpeg", zap.Int("width", width), zap.Int("height", height))
				ffStdin, ffStdout = spawnFfmpeg(logger, width, height, bitrate, framerate)
				go publisher(ffStdout)
			})

			ffStdin.Write((mat.ToBytes())) // TODO: handle error
		}
	}()

	return ffmpegFeeder
}

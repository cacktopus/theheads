package main

import (
	"fmt"
	"github.com/cacktopus/heads/camera/cpumon"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"gocv.io/x/gocv"
	"io"
	"io/ioutil"
	"os/exec"
	"runtime"
	"time"
)

func spawnFfmpeg() (
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
		"-r", fmt.Sprintf("%d", rate),
		"-i", "-",
		"-f", "mpegts",
		"-b:v", "400k",
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
		fmt.Println("Running")
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
		fmt.Println("Exited")
	}()

	return stdin, stdout
}

func runFfmpeg() chan gocv.Mat {
	ffmpegFeeder := make(chan gocv.Mat)
	ffStdin, ffStdout := spawnFfmpeg()
	go func() {
		for {
			mat := <-ffmpegFeeder
			ffStdin.Write((mat.ToBytes()))
		}
	}()

	go func() {
		buf := make([]byte, 1024*64)
		for {
			nread, err := ffStdout.Read(buf)
			broadcast <- buf[:nread]
			if err != nil {
				time.Sleep(1 * time.Second)
				panic(err)
			}
		}
	}()

	return ffmpegFeeder
}

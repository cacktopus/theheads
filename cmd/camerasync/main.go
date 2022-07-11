package main

import (
	"errors"
	"fmt"
	"github.com/robfig/cron/v3"
	"io"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type config struct {
	videoSrcDir    string
	combinedOutDir string
	tmpdir         string
	start, end     string
}

//var cfg = &config{
//	videoSrcDir:    "/Volumes/Toshiba-4TB/home03/videos/",
//	combinedOutDir: "/Volumes/Toshiba-4TB/home03/combined/",
//	tmpdir:         "/Volumes/Toshiba-4TB/tmp",
//	start:          "2022-04-25",
//	end:            "2022-06-08",
//}

var cfg = &config{
	videoSrcDir:    "/Volumes/Jonahcam-1/jonahcam",
	combinedOutDir: "/Volumes/Toshiba-4TB/jonahcam/combined",
	tmpdir:         "/Volumes/Toshiba-4TB/tmp",
	start:          "2021-01-27",
	end:            "2021-01-28",
}

func exists(filename string) bool {
	_, err := os.Stat(filename)
	return !errors.Is(err, os.ErrNotExist)
}

func main() {
	c := cron.New()
	_, err := c.AddFunc("*/2 * * * *", func() {
		fmt.Println("minute", time.Now().String())
	})
	noError(err)

	_, err = c.AddFunc("*/2 * * * *", sync)
	noError(err)

	//c.AddFunc("@hourly", func() { fmt.Println("Every hour") })
	//c.AddFunc("@every 1h30m", func() { fmt.Println("Every hour thirty") })
	noError(err)
	c.Start()

	begin, _ := time.Parse("2006-01-02", cfg.start)
	end, _ := time.Parse("2006-01-02", cfg.end)

	for t := begin; t.Before(end); t = t.AddDate(0, 0, 1) {
		datestr := t.Format("2006-01-02")
		encodeDate(datestr)
	}
}

func encodeDate(datestr string) {
	files, err := filepath.Glob(filepath.Join(cfg.videoSrcDir, datestr, "*.h264"))
	fmt.Println(strings.Join(files, "\n"))
	noError(err)
	outfile := filepath.Join(cfg.combinedOutDir, datestr+".mp4")
	if exists(outfile) {
		fmt.Println("outfile exists, skipping")
	} else if len(files) == 0 {
		fmt.Println("no files, skipping")
	} else {
		encode(files, outfile)
	}
}

func encode(files []string, outfile string) {
	sort.Strings(files)

	r, w, err := os.Pipe()
	noError(err)

	tmpdir, err := ioutil.TempDir(cfg.tmpdir, "")
	noError(err)

	defer func() {
		_ = os.RemoveAll(tmpdir)
	}()

	tmpfile := filepath.Join(tmpdir, "output.mp4")

	args := []string{
		"ffmpeg",
		"-i", "-",
		"-c:v", "libx265",
		"-crf", "22",
		"-preset", "fast",
		"-tag:v", "hvc1",
		tmpfile,
	}

	fmt.Println("cat", strings.Join(files, " "), "|", strings.Join(args, " "))
	cmd := exec.Command(args[0], args[1:]...)

	cmd.Stdin = r
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	done := make(chan error)

	go func() {
		done <- cmd.Run()
	}()

	for _, file := range files {
		fp, err := os.Open(file)
		noError(err)

		_, err = io.Copy(w, fp)
		noError(err)
	}

	noError(w.Close())
	noError(r.Close())

	noError(<-done)

	err = os.Rename(tmpfile, outfile)
}

func sync() {
	//exec.Command(
	//	"rsync",
	//	"-a", "--progress",
	//	"camera@home03:videos/",
	//	"/Volumes/Toshiba-4TB/home03/videos",
	//)
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

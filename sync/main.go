package main

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/pkg/errors"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

var hosts = strings.Fields(`
	home01.local
	home12.local
	pi11.local
	pi31.local
	pi32.local
	pi33.local
	pi40.local
	pi50.local
	power01.local
`)

func sync(dir, host string) {
	args := []string{
		"rsync",
		"--bwlimit", "1000k",
		"-av",
		dir + "/",
		fmt.Sprintf("syncthing@%s:", host),
	}

	r, w, err := os.Pipe()
	if err != nil {
		panic(err)
	}
	defer r.Close()
	defer w.Close()

	go func() {
		io.Copy(os.Stdout, r)
	}()

	fmt.Println(strings.Join(args, " "))
	cmd := exec.Command(args[0], args[1:]...)

	cmd.Stdout = w

	err = cmd.Run()
	if err != nil {
		panic(err)
	}
}

func main() {
	dir := os.Args[1]

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	manual := make(chan bool)

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				log.Println("event:", event)
				for _, host := range hosts {
					sync(dir, host)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			case <-manual:
				log.Println("manually triggered")
				for _, host := range hosts {
					sync(dir, host)
				}
			}
		}
	}()

	err = filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if info.IsDir() {
			fmt.Println("watching", path)
			err = watcher.Add(path)
			if err != nil {
				return errors.Wrap(err, "add watcher")
			}
		}
		return nil
	})
	if err != nil {
		panic(err)
	}

	manual <- true
	<-done
}

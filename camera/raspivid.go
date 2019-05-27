package main

import (
	"fmt"
	"io"
	"os/exec"
)

func runRaspiVid() (chan []byte, error) {
	frames := make(chan []byte)

	raspivid, err := exec.LookPath("raspivid")
	if err != nil {
		return nil, err
	}

	cmd := exec.Command(
		raspivid,
		"-n",
		"--contrast", "100",
		"-fps", fmt.Sprintf("%d", rate),
		"-t", "0",
		"-w", fmt.Sprintf("%d", width),
		"-h", fmt.Sprintf("%d", height),
		"--raw", "-",
		"-rf", "gray",
		"-hf",
		"-vf",
		"-o", "/dev/null",
	)

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

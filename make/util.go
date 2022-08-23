package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

var top string

func init() {
	var err error
	top, err = os.Getwd()
	if err != nil {
		panic(err)
	}
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

func cd(dir string, callback func()) {
	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	defer func() {
		err := os.Chdir(pwd)
		if err != nil {
			panic(err)
		}
	}()

	fmt.Println("cd", dir)
	err = os.Chdir(dir)
	if err != nil {
		panic(err)
	}
	callback()
}

func run(env []string, exe string, args ...string) {
	fmt.Println(strings.TrimSpace(strings.Join([]string{
		strings.Join(env, " "),
		exe,
		strings.Join(args, " "),
	}, " ")))

	cmd := exec.Command(exe, args...)
	cmd.Env = append(os.Environ(), env...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	noError(cmd.Run())
}

func output(env []string, exe string, args ...string) string {
	fmt.Println(strings.TrimSpace(strings.Join([]string{
		strings.Join(env, " "),
		exe,
		strings.Join(args, " "),
	}, " ")))
	cmd := exec.Command(exe, args...)
	cmd.Env = append(os.Environ(), env...)
	out, err := cmd.CombinedOutput()
	noError(err)
	return strings.TrimSpace(string(out))
}

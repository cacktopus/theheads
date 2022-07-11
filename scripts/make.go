package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
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

type builder interface {
	Build(name string) string
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

func buildSingle(name, arch string, env []string) string {
	tmp, err := ioutil.TempDir("", "")
	noError(err)
	defer func() {
		noError(os.RemoveAll(tmp))
	}()

	cd(filepath.Join("cmd", name), func() {
		run(env,
			"go",
			"build",
			"-o", filepath.Join(tmp, "bin")+"/",
			".",
		)
	})

	outputFile := fmt.Sprintf("%s/%s_0.0.0_%s.tar.gz", arch, name, arch)

	cd(tmp, func() {
		run(nil,
			"tar",
			"-czv",
			"-f", filepath.Join(top, "packages", outputFile),
			"bin",
		)
	})

	built := filepath.Join("packages", outputFile)

	return built
}

type arm6 struct{}

func (arm6) Build(name string) string {
	return buildSingle(name, "armv6", []string{
		"GOOS=linux",
		"GOARCH=arm",
		"GOARM=6",
	})
}

type arm7 struct{}

func (arm7) Build(name string) string {
	return buildSingle(name, "armhf", []string{
		"GOOS=linux",
		"GOARCH=arm",
		"GOARM=7",
	})
}

type arm64 struct{}

func (arm64) Build(name string) string {
	return buildSingle(name, "arm64", []string{
		"GOOS=linux",
		"GOARCH=arm64",
	})
}

type local struct{}

func (local) Build(name string) string {
	cd(filepath.Join("cmd", name), func() {
		run(nil,
			"go",
			"build",
			"-o", filepath.Join(top, "bin")+"/",
			".",
		)
	})

	return ""
}

var all = []builder{local{}, arm6{}, arm7{}, arm64{}}

type target struct {
	name      string
	platforms []builder
}

var targets = []target{
	{
		name:      "aht20",
		platforms: all,
	},
	{
		name:      "boss",
		platforms: []builder{local{}, arm64{}},
	},
	{
		name:      "head",
		platforms: []builder{local{}, arm7{}},
	},
	{
		name:      "heads-cli",
		platforms: all,
	},
	{
		name:      "logstream",
		platforms: all,
	},
	{
		name:      "minisign-verify",
		platforms: all,
	},
	{
		name:      "rtunneld",
		platforms: []builder{arm7{}, arm64{}},
	},
	{
		name:      "set-rtc-time",
		platforms: all,
	},
	{
		name:      "solar",
		platforms: []builder{arm64{}},
	},
	{
		name:      "system-tools",
		platforms: []builder{arm7{}, arm64{}},
	},
	{
		name:      "timesync",
		platforms: all,
	},
	{
		name:      "web",
		platforms: all,
	},
}

func main() {
	for _, target := range os.Args[1:] {
		buildSelected(target)
	}
}

func buildSelected(target string) {
	fmt.Println("==================", target, "==================")
	for _, t := range targets {
		if t.name == target {
			build(t)
			return
		}
	}
	panic("unknown target")
}

func build(t target) {
	var allBuilt []string
	for _, p := range t.platforms {
		built := p.Build(t.name)
		if built != "" {
			allBuilt = append(allBuilt, built)
		}
	}

	fmt.Println("scripts/release", strings.Join(allBuilt, " "))
}

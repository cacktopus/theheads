package main

import "path/filepath"

type builder interface {
	Build(name string) string
}

type armv6 struct{}

func (armv6) Build(name string) string {
	return buildSingle(name, getTag(), "armv6", []string{
		"GOOS=linux",
		"GOARCH=arm",
		"GOARM=6",
	})
}

type armhf struct{}

func (armhf) Build(name string) string {
	return buildSingle(name, getTag(), "armhf", []string{
		"GOOS=linux",
		"GOARCH=arm",
		"GOARM=7",
	})
}

type arm64 struct{}

func (arm64) Build(name string) string {
	return buildSingle(name, getTag(), "arm64", []string{
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

var all = []builder{local{}, armv6{}, armhf{}, arm64{}}

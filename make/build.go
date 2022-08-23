package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

func buildSingle(name, version, arch string, env []string) string {
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

	outputFile := fmt.Sprintf("%s/%s_%s_%s.tar.gz", arch, name, version, arch)

	cd(tmp, func() {
		run(nil,
			"tar",
			"-czv",
			"-f", filepath.Join(cfg.SharedFolder, "builds", outputFile),
			"bin",
		)
	})

	built := filepath.Join(cfg.SharedFolder, "builds", outputFile)

	return built
}

type target struct {
	name      string
	platforms []builder
}

func build(t target) {
	var allBuilt []string
	for _, p := range t.platforms {
		built := p.Build(t.name)
		if built != "" {
			allBuilt = append(allBuilt, built)
		}
	}
}

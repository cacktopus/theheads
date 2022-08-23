package main

import (
	"fmt"
	"github.com/pkg/errors"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

var rules = map[string]func(rule string){
	"bin/aht20":           bin,
	"bin/boss":            bin,
	"bin/camera":          bin,
	"bin/head":            bin,
	"bin/heads-cli":       bin,
	"bin/leds":            bin,
	"bin/logstream":       bin,
	"bin/lowred":          bin,
	"bin/minisign-verify": bin,
	"bin/rtunneld":        bin,
	"bin/set-system-time": bin,
	"bin/solar":           bin,
	"bin/metrics-finder":  bin,
	"bin/timesync":        bin,
	"bin/web":             bin,

	"aht20-arm64":           pkg,
	"boss-arm64":            steps(bossFrontend, pkg),
	"heads-cli-arm64":       pkg,
	"logstream-arm64":       pkg,
	"minisign-verify-arm64": pkg,
	"rtunneld-arm64":        pkg,
	"set-system-time-arm64": pkg,
	"solar-arm64":           pkg,
	"timesync-arm64":        pkg,
	"metrics-finder-arm64":  pkg,
	"web-arm64":             pkg,
	"lowred-arm64":          docker,
	"leds-arm64":            docker,
	"camera-arm64":          docker,

	"aht20-armhf":           pkg,
	"head-armhf":            pkg,
	"heads-cli-armhf":       pkg,
	"logstream-armhf":       pkg,
	"minisign-verify-armhf": pkg,
	"rtunneld-armhf":        pkg,
	"set-system-time-armhf": pkg,
	"timesync-armhf":        pkg,
	"web-armhf":             pkg,
	"camera-armhf":          docker,
	"leds-armhf":            docker,
	"lowred-armhf":          docker,

	"aht20-armv6":           pkg,
	"heads-cli-armv6":       pkg,
	"logstream-armv6":       pkg,
	"minisign-verify-armv6": pkg,
	"set-system-time-armv6": pkg,
	"timesync-armv6":        pkg,
	"web-armv6":             pkg,
	"lowred-armv6":          docker,

	"docker-armhf-builder": func(string) {
		run(nil, "docker", "build",
			"--platform", "linux/arm/v7",
			"--tag", "heads-build-armhf",
			"-f", "arm/Dockerfile.build-armhf",
			".",
		)
	},

	"docker-armv6-builder": func(string) {
		run(nil, "docker", "build",
			"--platform", "linux/arm/v6",
			"--tag", "heads-build-armv6",
			"-f", "arm/Dockerfile.build-armv6",
			".",
		)
	},

	"docker-arm64-builder": func(string) {
		run(nil, "docker", "build",
			"--platform", "linux/arm64/v8",
			"--tag", "heads-build-arm64",
			"-f", "arm/Dockerfile.build-arm64",
			".",
		)
	},

	"docker-amd64-builder": func(string) {
		run(nil, "docker", "build",
			"--platform", "linux/amd64",
			"--tag", "heads-build-amd64",
			"-f", "arm/Dockerfile.build-amd64",
			".",
		)
	},

	"sign": func(s string) {
		findUnexpected()
		fmt.Println("minisign -S -m", strings.Join(lsUnsigned(), " "))
	},

	"sign2": sign2,

	"ls-unsigned": func(_ string) {
		fmt.Println(strings.Join(lsUnsigned(), "\n"))
	},

	"boss/frontend": bossFrontend,

	"rclone-up": func(rule string) {
		if len(lsUnsigned()) > 0 {
			panic("found unsigned files")
		}
		findUnexpected()
		run(nil, "rclone", "copy", "-P", filepath.Join(cfg.SharedFolder, "builds/"), "do:theheads/shared/builds/")
	},

	"rclone-down": func(rule string) {
		if len(lsUnsigned()) > 0 {
			panic("found unsigned files")
		}
		findUnexpected()
		run(nil, "rclone", "copy", "-P", "do:theheads/shared/builds/", filepath.Join(cfg.SharedFolder, "builds/"))
	},

	"fast-head":      fasthead,
	"fast-boss":      fastboss,
	"fast-camera":    fastcamera,
	"fast-leds":      fastleds,
	"fast-heads-cli": fastheadscli,
}

func fastcamera(rule string) {
	docker("camera-armhf")
	copyCamera("camera-armhf")
	run(nil, "rsync", "-z", "--progress", "bin/camera-armhf", "head03:")
}

func fasthead(rule string) {
	run([]string{"GOOS=linux", "GOARCH=arm", "GOARM=7"},
		"go", "build", "-o", "bin/head-armhf", "./cmd/head",
	)
	run(nil, "rsync", "-z", "--progress", "bin/head-armhf", "head03:")
}

func fastboss(rule string) {
	bossFrontend("boss/frontend")
	run([]string{"GOOS=linux", "GOARCH=arm64"},
		"go", "build", "-o", "bin/boss-arm64", "./cmd/boss",
	)
	run(nil, "rsync", "-z", "--progress", "bin/boss-arm64", "base01:")
}

func fastheadscli(rule string) {
	run([]string{"GOOS=linux", "GOARCH=arm64"},
		"go", "build", "-o", "bin/heads-cli-arm64", "./cmd/heads-cli",
	)
	run(nil, "rsync", "-z", "--progress", "bin/heads-cli-arm64", "base01:")
}

func fastleds(rule string) {
	docker("leds-armhf")
	copyLeds("leds-armhf")
	run(nil, "rsync", "-z", "--progress", "bin/leds-armhf", "pi@dev01:")
}

func findUnexpected() {
	err := filepath.WalkDir(filepath.Join(cfg.SharedFolder, "builds/"), func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			return nil
		}

		if strings.Contains(path, "-dirty") {
			panic("dirty file: " + path)
		}

		switch filepath.Ext(path) {
		case ".gz", ".minisig", ".deb":
			return nil
		default:
			panic("unexpected file: " + path)
		}
	})
	if err != nil {
		panic(err)
	}
}

func lsUnsigned() []string {
	var unsigned []string
	err := filepath.WalkDir(filepath.Join(cfg.SharedFolder, "builds/"), func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			return nil
		}

		ext := filepath.Ext(path)

		switch ext {
		case ".gz", ".deb":
		// pass
		default:
			return nil
		}

		if fileExists(path + ".minisig") {
			return nil
		}

		unsigned = append(unsigned, path)

		return nil
	})
	noError(err)

	return unsigned
}

func copyCamera(rule string) {
	if !strings.Contains(rule, "armhf") {
		panic("not yet")
	}

	dockerCopy("armhf", "camera-armhf", "/build/bin/camera", "bin/camera-armhf")
}

func copyLeds(rule string) {
	if !strings.Contains(rule, "armhf") {
		panic("not yet")
	}

	dockerCopy("armhf", "leds-armhf", "/build/bin/leds", "bin/leds-armhf")
}

func bossFrontend(rule string) {
	run([]string{"GOOS=js", "GOARCH=wasm"},
		"go", "build",
		"-o", "./boss/frontend/fe/main.wasm",
		"./boss/frontend",
	)
}

func steps(steplist ...func(rule string)) func(string) {
	return func(rule string) {
		for _, step := range steplist {
			step(rule)
		}
	}
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return !errors.Is(err, os.ErrNotExist)
}

func init() {
	rules["arm64-all"] = func(string) {
		for rule, callback := range rules {
			if strings.HasSuffix(rule, "arm64") {
				callback(rule)
			}
		}
	}
	rules["armhf-all"] = func(string) {
		for rule, callback := range rules {
			if strings.HasSuffix(rule, "armhf") {
				callback(rule)
			}
		}
	}
	rules["armv6-all"] = func(string) {
		for rule, callback := range rules {
			if strings.HasSuffix(rule, "armv6") {
				callback(rule)
			}
		}
	}
	rules["bin-all"] = func(string) {
		for rule, callback := range rules {
			if strings.HasPrefix(rule, "bin/") {
				callback(rule)
			}
		}
	}
}

package main

import (
	"fmt"
	"github.com/minor-industries/grm"
	"os"
	"path/filepath"
	"strings"
)

var rules = map[string]func(rule string){
	//"bin/boss":            bin,
	"bin/camera":          grm.Bin,
	"bin/head":            grm.Bin,
	"bin/heads-cli":       grm.Bin,
	"bin/leds":            grm.Bin,
	"bin/lowred":          grm.Bin,
	"bin/set-system-time": grm.Bin,
	"bin/solar":           grm.Bin,
	"bin/timesync":        grm.Bin,
	"bin/web":             grm.Bin,

	"boss-arm64":            grm.Steps(bossFrontend, grm.Pkg),
	"heads-cli-arm64":       grm.Pkg,
	"head-arm64":            grm.Pkg,
	"set-system-time-arm64": grm.Pkg,
	"solar-arm64":           grm.Pkg,
	"timesync-arm64":        grm.Pkg,
	"web-arm64":             grm.Pkg,
	//"lowred-arm64":          docker,
	//"leds-arm64":            docker,
	"camera-arm64":      grm.Docker,
	"shellystats-arm64": grm.Pkg,
	"carrier-arm64":     grm.Pkg,

	"head-armhf":            grm.Pkg,
	"heads-cli-armhf":       grm.Pkg,
	"set-system-time-armhf": grm.Pkg,
	"timesync-armhf":        grm.Pkg,
	"web-armhf":             grm.Pkg,
	"camera-armhf":          grm.Docker,
	"leds-armhf":            grm.Docker,
	"lowred-armhf":          grm.Docker,

	"heads-cli-armv6":       grm.Pkg,
	"set-system-time-armv6": grm.Pkg,
	"timesync-armv6":        grm.Pkg,
	"web-armv6":             grm.Pkg,
	"lowred-armv6":          grm.Docker,

	"pibuild-all": func(_ string) {
		var err error
		err = os.MkdirAll(filepath.Join(grm.Opts.SharedFolder, "builds", "armhf"), 0o750)
		noError(err)

		err = os.MkdirAll(filepath.Join(grm.Opts.SharedFolder, "builds", "arm64"), 0o750)
		noError(err)

		//grm.Pkg("camera-armhf")
		grm.Pkg("head-armhf")
		grm.Pkg("heads-cli-armhf")
		//grm.Pkg("leds-armhf")
		//grm.Pkg("lowred-armhf")
		grm.Pkg("set-system-time-armhf")
		grm.Pkg("timesync-armhf")
		grm.Pkg("web-armhf")

		bossFrontend("boss-arm64")

		grm.Pkg("boss-arm64")
		grm.Pkg("heads-cli-arm64")
		grm.Pkg("set-system-time-arm64")
		grm.Pkg("solar-arm64")
		grm.Pkg("timesync-arm64")
		grm.Pkg("web-arm64")
	},

	"docker-armhf-builder": func(string) {
		grm.Run(nil, "docker", "build",
			"--platform", "linux/arm/v7",
			"--tag", "heads-build-armhf",
			"-f", "make/arm/Dockerfile.build-armhf",
			".",
		)
	},

	"docker-armv6-builder": func(string) {
		grm.Run(nil, "docker", "build",
			"--platform", "linux/arm/v6",
			"--tag", "heads-build-armv6",
			"-f", "make/arm/Dockerfile.build-armv6",
			".",
		)
	},

	"docker-arm64-builder": func(string) {
		grm.Run(nil, "docker", "build",
			"--platform", "linux/arm64/v8",
			"--tag", "heads-build-arm64",
			"-f", "make/arm/Dockerfile.build-arm64",
			".",
		)
	},

	"docker-amd64-builder": func(string) {
		grm.Run(nil, "docker", "build",
			"--platform", "linux/amd64",
			"--tag", "heads-build-amd64",
			"-f", "make/arm/Dockerfile.build-amd64",
			".",
		)
	},

	"sign": func(s string) {
		grm.FindUnexpected()
		fmt.Println("minisign -S -m", strings.Join(grm.LsUnsigned(), " "))
	},

	"sign2": grm.Sign2,

	"ls-unsigned": func(_ string) {
		fmt.Println(strings.Join(grm.LsUnsigned(), "\n"))
	},

	"boss/frontend": bossFrontend,

	"rclone-up": func(rule string) {
		if len(grm.LsUnsigned()) > 0 {
			panic("found unsigned files")
		}
		grm.FindUnexpected()
		grm.Run(nil, "rclone", "copy", "-P", filepath.Join(grm.Opts.SharedFolder, "builds/"), "do:theheads/shared/builds/")
	},

	"rclone-down": func(rule string) {
		if len(grm.LsUnsigned()) > 0 {
			panic("found unsigned files")
		}
		grm.FindUnexpected()
		grm.Run(nil, "rclone", "copy", "-P", "do:theheads/shared/builds/", filepath.Join(grm.Opts.SharedFolder, "builds/"))
	},

	"fast-head":      fasthead,
	"fast-boss":      fastboss,
	"fast-camera":    fastcamera,
	"fast-camera64":  fastcamera64,
	"fast-leds":      fastleds,
	"fast-heads-cli": fastheadscli,

	"protos": func(rule string) {
		protoFiles, err := filepath.Glob("protos/*.proto")
		noError(err)

		args := []string{
			"/bin/protoc",
			"--proto_path=./protos",
			"-I/build/include",
			"--go_out=plugins=grpc,paths=source_relative:./gen/go/heads",
		}

		for _, file := range protoFiles {
			// this may run into trouble if there are two proto files with the same name in
			// different directories
			base := filepath.Base(file)
			opt := fmt.Sprintf("--go_opt=M%s=github.com/cacktopus/theheads/gen/go/heads", base)
			args = append(args, opt)
		}

		args = append(args, protoFiles...)

		grm.RunDocker("heads-protoc", args...)
	},

	"heads-protoc": func(rule string) {
		grm.Cd("common", func() {
			grm.Run(nil, "docker", "build", "--tag", "heads-protoc", "protos")
		})
	},

	"reflex-gear-fe": func(rule string) {
		// reflex -v -g '**/*.go' -- go build -o frontend/fe/Run.wasm ./frontend
		grm.Cd("gears", func() {
			grm.Run([]string{
				"GOOS=js",
				"GOARCH=wasm",
			}, "reflex", "-v", "-g", "**/*.go", "--", "go", "build", "-o", "frontend/fe/Run.wasm", "./frontend")
		})
	},
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

func fastcamera64(rule string) {
	grm.Docker("camera-arm64")
	copyCameraARM64("camera-arm64")
	grm.Run(nil, "rsync", "-z", "--progress", "bin/camera-arm64", "camera@dev01:camera")
}

func fastcamera(rule string) {
	grm.Docker("camera-armhf")
	copyCamera("camera-armhf")
	grm.Run(nil, "rsync", "-z", "--progress", "bin/camera-armhf", "pi@dev02:")
}

func fasthead(rule string) {
	grm.Run([]string{"GOOS=linux", "GOARCH=arm64"},
		"go", "build", "-o", "bin/head-arm64", "./cmd/head",
	)
	grm.Run(nil, "rsync", "-z", "--progress", "bin/head-arm64", "head@dev01-inet:head")
}

func fastboss(rule string) {
	bossFrontend("boss/frontend")
	grm.Run([]string{"GOOS=linux", "GOARCH=arm64"},
		"go", "build", "-o", "bin/boss-arm64", "./cmd/boss",
	)
	grm.Run(nil, "rsync", "-z", "--progress", "bin/boss-arm64", "base01:")
}

func fastheadscli(rule string) {
	grm.Run([]string{"GOOS=linux", "GOARCH=arm64"},
		"go", "build", "-o", "bin/heads-cli-arm64", "./cmd/heads-cli",
	)
	grm.Run(nil, "rsync", "-z", "--progress", "bin/heads-cli-arm64", "base01:")
}

func fastleds(rule string) {
	grm.Docker("leds-armhf")
	copyLeds("leds-armhf")
	grm.Run(nil, "rsync", "-z", "--progress", "bin/leds-armhf", "pi@dev01:")
}

func copyCamera(rule string) {
	if !strings.Contains(rule, "armhf") {
		panic("not yet")
	}

	grm.DockerCopy("armhf", "camera-armhf", "/build/bin/camera", "bin/camera-armhf")
}

func copyCameraARM64(rule string) {
	if !strings.Contains(rule, "arm64") {
		panic("not yet")
	}

	grm.DockerCopy("arm64", "camera-arm64", "/build/bin/camera", "bin/camera-arm64")
}

func copyLeds(rule string) {
	if !strings.Contains(rule, "armhf") {
		panic("not yet")
	}

	grm.DockerCopy("armhf", "leds-armhf", "/build/bin/leds", "bin/leds-armhf")
}

func bossFrontend(rule string) {
	grm.Run([]string{"GOOS=js", "GOARCH=wasm"},
		"go", "build",
		"-o", "./boss/frontend/fe/Run.wasm",
		"./boss/frontend",
	)
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

func main() {
	grm.Main(rules)
}

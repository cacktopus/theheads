package main

import (
	"fmt"
	"strings"
)

func dockerInternal(arch, pkgName string) {
	imageTag := fmt.Sprintf("%s-%s", pkgName, arch)
	run(nil, "docker", "build",
		"--platform", archToDockerPlatform(arch),
		"--tag", imageTag,
		"--build-arg", fmt.Sprintf("TAG=%s", getTag()),
		"-f", fmt.Sprintf("cmd/%s/Dockerfile.%s", pkgName, arch),
		".",
	)

	src := fmt.Sprintf("/build/%s_%s_%s.tar.gz", pkgName, getTag(), arch)
	dst := fmt.Sprintf("%s/builds/%s", cfg.SharedFolder, arch)

	dockerCopy(
		arch,
		imageTag,
		src,
		dst,
	)
}

func dockerCopy(
	arch string,
	imageTag string,
	src string,
	dst string,
) {
	container := output(nil, "docker", "container", "create", "--platform", archToDockerPlatform(arch), imageTag)

	run(nil, "docker", "cp",
		fmt.Sprintf("%s:%s", container, src),
		dst,
	)
}

func docker(rule string) {
	parts := strings.Split(rule, "-")
	if len(parts) < 2 {
		panic("invalid rule")
	}
	arch := parts[len(parts)-1]
	pkgName := strings.Join(parts[:len(parts)-1], "-")

	dockerInternal(arch, pkgName)
}

func archToDockerPlatform(arch string) string {
	switch arch {
	case "arm64":
		return "linux/arm64/v8"
	case "armhf":
		return "linux/arm/v7"
	case "armv6":
		return "linux/arm/v6"
	default:
		panic("unknown arch")
	}
}

package main

import "strings"

func bin(rule string) {
	parts := strings.Split(rule, "/")
	if len(parts) != 2 {
		panic("invalid rule")
	}

	if parts[0] != "bin" {
		panic("invalid rule")
	}

	build(target{
		name:      parts[1],
		platforms: []builder{local{}},
	})
}

var platformLookup = map[string]builder{
	"arm64": arm64{},
	"armhf": armhf{},
	"armv6": armv6{},
}

func pkg(rule string) {
	parts := strings.Split(rule, "-")
	if len(parts) < 2 {
		panic("invalid rule")
	}
	builderName := parts[len(parts)-1]
	pkgName := strings.Join(parts[:len(parts)-1], "-")

	b, ok := platformLookup[builderName]
	if !ok {
		panic("invalid builder")
	}

	build(target{
		name:      pkgName,
		platforms: []builder{b},
	})
}

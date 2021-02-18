module github.com/cacktopus/theheads/heads-cli

go 1.14

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/grandcat/zeroconf v1.0.0
	github.com/pkg/errors v0.9.1
	github.com/spf13/cobra v1.1.1
	go.uber.org/zap v1.16.0
	google.golang.org/grpc v1.34.0
)

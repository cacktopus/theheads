module github.com/cacktopus/theheads/system-tools

go 1.14

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/grandcat/zeroconf v1.0.0
	github.com/vrischmann/envconfig v1.3.0
	go.uber.org/zap v1.16.0
)

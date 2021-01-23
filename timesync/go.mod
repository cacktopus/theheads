module github.com/cacktopus/theheads/timesync

go 1.15

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-20200916051200-274ec778eaae
	github.com/grandcat/zeroconf v1.0.0
	github.com/prometheus/client_golang v1.9.0
	github.com/vrischmann/envconfig v1.3.0
	go.uber.org/zap v1.16.0
	google.golang.org/grpc v1.34.0
)

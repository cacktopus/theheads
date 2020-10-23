module github.com/cacktopus/theheads/voices

go 1.13

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.6.3
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v1.7.1
	github.com/vrischmann/envconfig v1.3.0
	go.uber.org/zap v1.16.0
)

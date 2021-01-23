module github.com/cacktopus/theheads/boss

go 1.12

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/gin-contrib/pprof v1.2.0
	github.com/gin-gonic/gin v1.6.3
	github.com/gorilla/websocket v1.4.1
	github.com/grandcat/zeroconf v1.0.0
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v1.9.0
	github.com/sirupsen/logrus v1.6.0
	github.com/vrischmann/envconfig v1.3.0
	go.uber.org/zap v1.16.0
	gonum.org/v1/gonum v0.0.0-20190710053202-4340aa3071a0
	google.golang.org/grpc v1.34.0
	gopkg.in/yaml.v2 v2.3.0
)

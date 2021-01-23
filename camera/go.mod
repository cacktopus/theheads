module github.com/cacktopus/theheads/camera

go 1.12

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/gorilla/websocket v1.4.1
	github.com/prometheus/client_golang v1.4.0
	github.com/sirupsen/logrus v1.6.0
	github.com/soheilhy/cmux v0.1.4
	github.com/vrischmann/envconfig v1.3.0
	gocv.io/x/gocv v0.24.0
	golang.org/x/sys v0.0.0-20200124204421-9fbb57f87de9 // indirect
	google.golang.org/grpc v1.34.0
	google.golang.org/grpc/examples v0.0.0-20201226181154-53788aa5dcb4 // indirect
)

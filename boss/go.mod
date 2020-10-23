module github.com/cacktopus/theheads/boss

go 1.12

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/armon/go-metrics v0.3.0 // indirect
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/gin-contrib/pprof v1.2.0
	github.com/gin-contrib/sse v0.0.0-20190301062529-5545eab6dad3 // indirect
	github.com/gin-gonic/gin v1.3.0
	github.com/gomodule/redigo v1.8.2
	github.com/gorilla/websocket v1.4.1
	github.com/hashicorp/consul/api v1.3.0
	github.com/hashicorp/go-immutable-radix v1.1.0 // indirect
	github.com/hashicorp/go-rootcerts v1.0.2 // indirect
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/hashicorp/serf v0.8.5 // indirect
	github.com/mattn/go-isatty v0.0.7 // indirect
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v1.4.0
	github.com/sirupsen/logrus v1.6.0
	github.com/vrischmann/envconfig v1.3.0
	golang.org/x/sys v0.0.0-20200124204421-9fbb57f87de9 // indirect
	gonum.org/v1/gonum v0.0.0-20190710053202-4340aa3071a0
	gopkg.in/yaml.v2 v2.2.5
)

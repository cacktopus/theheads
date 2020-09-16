module github.com/cacktopus/heads/timesync

go 1.12

require (
	github.com/cacktopus/heads/boss v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.5.0
	github.com/hashicorp/consul/api v1.1.0
	github.com/prometheus/client_golang v1.4.1
	github.com/sirupsen/logrus v1.4.2
)

replace github.com/cacktopus/heads/boss => ../boss/

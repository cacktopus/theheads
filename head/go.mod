module github.com/cacktopus/theheads/head

go 1.13

replace gobot.io/x/gobot => github.com/cacktopus/gobot v1.14.1-0.20200917005259-a4270fc0f114

replace github.com/cacktopus/theheads/common => ../common

require (
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/gin-gonic/gin v1.6.3
	github.com/golang/protobuf v1.4.2
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v1.4.0
	github.com/stretchr/testify v1.6.1
	github.com/vrischmann/envconfig v1.3.0
	go.uber.org/multierr v1.6.0 // indirect
	go.uber.org/zap v1.16.0
	gobot.io/x/gobot v0.0.0-00010101000000-000000000000
	golang.org/x/net v0.0.0-20200904194848-62affa334b73 // indirect
	golang.org/x/sys v0.0.0-20200916084744-dbad9cb7cb7a // indirect
	golang.org/x/text v0.3.3 // indirect
	google.golang.org/genproto v0.0.0-20200916143405-f6a2fa72f0c4 // indirect
	google.golang.org/grpc v1.32.0
	google.golang.org/protobuf v1.25.0
)

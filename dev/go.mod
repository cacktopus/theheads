module github.com/cacktopus/theheads/dev

go 1.15

replace (
	github.com/cacktopus/theheads/boss => ../boss
	github.com/cacktopus/theheads/common => ../common
	github.com/cacktopus/theheads/head => ../head
	gobot.io/x/gobot => github.com/cacktopus/gobot v1.14.1-0.20200917005259-a4270fc0f114
)

require (
	github.com/Microsoft/go-winio v0.4.16 // indirect
	github.com/cacktopus/theheads/boss v0.0.0-00010101000000-000000000000
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/cacktopus/theheads/head v0.0.0-00010101000000-000000000000
	github.com/cenkalti/backoff/v3 v3.2.2 // indirect
	github.com/containerd/continuity v0.0.0-20201208142359-180525291bb7 // indirect
	github.com/gin-gonic/gin v1.6.3
	github.com/moby/term v0.0.0-20201216013528-df9cb8a40635 // indirect
	github.com/ory/dockertest/v3 v3.6.3
	github.com/pkg/errors v0.9.1
	github.com/sirupsen/logrus v1.7.0 // indirect
	go.uber.org/zap v1.16.0
	golang.org/x/net v0.0.0-20210119194325-5f4716e94777 // indirect
	golang.org/x/sys v0.0.0-20210124154548-22da62e12c0c // indirect
)

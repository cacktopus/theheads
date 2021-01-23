module github.com/cacktopus/theheads/dev

go 1.15

replace (
	github.com/cacktopus/theheads/boss => ../boss
	github.com/cacktopus/theheads/common => ../common
	github.com/cacktopus/theheads/head => ../head
	gobot.io/x/gobot => github.com/cacktopus/gobot v1.14.1-0.20200917005259-a4270fc0f114
)

require (
	github.com/cacktopus/theheads/boss v0.0.0-00010101000000-000000000000
	github.com/cacktopus/theheads/common v0.0.0-00010101000000-000000000000
	github.com/cacktopus/theheads/head v0.0.0-00010101000000-000000000000
)

module raftsync

go 1.14

replace github.com/ory/dockertest.git => ../dockertest

require (
	github.com/cenkalti/backoff/v3 v3.2.2 // indirect
	github.com/containerd/continuity v0.0.0-20200710164510-efbc4488d8fe // indirect
	github.com/davecgh/go-spew v1.1.1
	github.com/gin-gonic/gin v1.6.3
	github.com/go-playground/validator/v10 v10.3.0 // indirect
	github.com/golang/protobuf v1.4.2
	github.com/google/uuid v1.1.2
	github.com/hashicorp/raft v1.1.2
	github.com/hashicorp/raft-boltdb v0.0.0-20171010151810-6e5ba93211ea
	github.com/json-iterator/go v1.1.10 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.1 // indirect
	github.com/opencontainers/go-digest v1.0.0 // indirect
	github.com/ory/dockertest/v3 v3.6.0
	github.com/pkg/errors v0.9.1
	github.com/prometheus/client_golang v0.9.2
	github.com/sirupsen/logrus v1.6.0 // indirect
	github.com/stretchr/testify v1.6.1
	github.com/vrischmann/envconfig v1.3.0
	golang.org/x/net v0.0.0-20200822124328-c89045814202 // indirect
	golang.org/x/sys v0.0.0-20200826173525-f9321e4c35a6 // indirect
	golang.org/x/text v0.3.3 // indirect
	google.golang.org/genproto v0.0.0-20200829155447-2bf3329a0021 // indirect
	google.golang.org/grpc v1.31.1
	google.golang.org/protobuf v1.25.0
	gopkg.in/yaml.v2 v2.3.0 // indirect
)

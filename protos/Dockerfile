FROM heads-build-arm64

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends unzip

RUN curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v3.18.1/protoc-3.18.1-linux-aarch_64.zip

COPY checksums .
RUN shasum -a 256 -c checksums

RUN git clone https://github.com/golang/protobuf
RUN (cd protobuf && git reset --hard v1.4.3 && go install ./protoc-gen-go)

RUN unzip protoc-*-linux-aarch_64.zip
RUN cp bin/protoc /go/bin/protoc-gen-go /bin

WORKDIR /
RUN go install storj.io/drpc/cmd/protoc-gen-go-drpc@v0.0.20

WORKDIR /build

CMD ["/bin/protoc"]

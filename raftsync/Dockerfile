FROM golang:1.14-alpine as build

WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build . && go build ./cmd/cli

WORKDIR /app
RUN cp /build/raftdemo /build/cli .

RUN mkdir -p fs/0 fs/1 fs/2


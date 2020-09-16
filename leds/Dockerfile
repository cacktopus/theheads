FROM golang:1.14-buster as build

WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=1 go build .

FROM golang:1.14-buster as package

COPY --from=build /build/leds /install/leds/

ARG VERSION

RUN mkdir -p /packages
RUN arch=`dpkg-architecture -q DEB_BUILD_ARCH`; \
    tar -czvf /packages/leds_${VERSION}_${arch}.tar.gz -C /install leds

RUN arch=`dpkg-architecture -q DEB_BUILD_ARCH`; \
    curl -XPUT \
    http://raftsync.service.consul:9000/theheads/build/leds_${VERSION}_${arch}.tar.gz \
    --data-binary @/packages/leds_${VERSION}_${arch}.tar.gz
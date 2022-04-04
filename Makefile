BUILD=docker build
TOP=$(shell pwd)
ARMV6=GOOS=linux GOARCH=arm GOARM=6
ARMHF=GOOS=linux GOARCH=arm GOARM=7
ARM64=GOOS=linux GOARCH=arm64

.PHONY: build-arm
build-arm:
	$(BUILD) --platform linux/arm/v7 --tag heads-build-arm -f arm/Dockerfile.build-arm .

.PHONY: build-arm64
build-arm64:
	$(BUILD) --platform linux/arm64/v8 --tag heads-build-arm64 -f arm/Dockerfile.build-arm64 .

.PHONY: build-armv6
build-armv6:
	$(BUILDX) --load --platform linux/arm/v6 --tag heads-build-armv6 -f arm/Dockerfile.build-armv6 .

.PHONY: build-amd64
build-amd64:
	$(BUILDX) --load --platform linux/amd64 --tag heads-build-amd64 -f arm/Dockerfile.build-amd64 .

.PHONY: %-arm
%-arm:
	$(BUILD) --platform linux/arm/v6 --tag $*-arm -f $*/Dockerfile.arm .
	docker cp `docker container create --platform linux/arm/v7 $*-arm`:/build/$*_0.0.0_armhf.tar.gz .
	shasum -a 256 $*_0.0.0_armhf.tar.gz

.PHONY: %-arm64
%-arm64: dirs
	time $(BUILD) --platform linux/arm64/v8 --tag $*-arm64 -f cmd/$*/Dockerfile.arm64 .
	docker cp `docker container create --platform linux/arm64/v8 $*-arm64`:/build/$*_0.0.0_arm64.tar.gz packages/arm64
	echo scripts/release packages/arm64/$*_0.0.0_arm64.tar.gz

.PHONY: %-armv6
%-armv6:
	time $(BUILD) --platform linux/arm/v6 --tag $*-armv6 -f $*/Dockerfile.armv6 .
	docker cp `docker container create --platform linux/arm/v6 $*-armv6`:/build/$*_0.0.0_armv6.tar.gz .
	shasum -a 256 $*_0.0.0_armv6.tar.gz

.PHONY: %-amd64
%-amd64:
	time $(BUILD) --tag $*-amd64 -f $*/Dockerfile.amd64 .
	docker cp `docker container create $*-amd64`:/build/$*_0.0.0_amd64.tar.gz .
	shasum -a 256 $*_0.0.0_amd64.tar.gz

.PHONY: camera
camera:
	$(BUILD) --tag camera -f Dockerfile.camera.all .

.PHONY: boss-ui
boss-ui:
	cd boss-ui && docker build --tag boss-ui .

.PHONY: bin/heads-cli
bin/heads-cli:
	(cd heads-cli && go build -o ../bin/ .)

.PHONY: bin/camera
bin/camera:
	(cd cmd/camera && go build -o ${TOP}/bin/ .)

.PHONY: bin/leds
bin/leds:
	(cd cmd/leds && go build -o ${TOP}/bin/ .)

.PHONY: bin/rtunneld
bin/rtunneld:
	(cd cmd/rtunneld && go build -o ${TOP}/bin/ .)

.PHONY: bin/web
bin/web:
	(cd cmd/web && go build -o ${TOP}/bin/ .)

.PHONY: packages/arm64/system-tools
packages/arm64/system-tools: dirs
	(cd system-tools && GOOS=linux GOARCH=arm64 go build -o ${TOP}/build/arm64/ .)
	(cd build/arm64 && tar -czvf ${TOP}/packages/system-tools_0.0.0_arm64.tar.gz system-tools)

.PHONY: packages/arm64/rtunneld
packages/arm64/rtunneld: bin/rtunneld
	tar -czvf ${TOP}/packages/arm64/rtunneld_0.0.0_arm64.tar.gz bin/rtunneld
	echo scripts/release packages/arm64/rtunneld_0.0.0_arm64.tar.gz

.PHONY: packages/armhf/rtunneld
packages/armhf/rtunneld:
	${ARMHF} make bin/rtunneld
	tar -czvf ${TOP}/packages/armhf/rtunneld_0.0.0_armhf.tar.gz bin/rtunneld
	echo scripts/release packages/armhf/rtunneld_0.0.0_armhf.tar.gz

.PHONY: packages/armhf/web
packages/armhf/web:
	${ARMHF} make bin/web
	tar -czvf ${TOP}/packages/armhf/web_0.0.0_armhf.tar.gz bin/web
	echo scripts/release packages/armhf/web_0.0.0_armhf.tar.gz

.PHONY: packages/arm64/web
packages/arm64/web:
	${ARM64} make bin/web
	tar -czvf ${TOP}/packages/arm64/web_0.0.0_arm64.tar.gz bin/web
	echo scripts/release packages/arm64/web_0.0.0_arm64.tar.gz

.PHONY: packages/armv6/web
packages/armv6/web:
	${ARMV6} make bin/web
	tar -czvf ${TOP}/packages/armv6/web_0.0.0_armv6.tar.gz bin/web
	echo scripts/release packages/armv6/web_0.0.0_armv6.tar.gz

.PHONY: web-all
web-all: packages/armv6/web packages/armhf/web packages/arm64/web

dirs:
	mkdir -p ${TOP}/packages/{armv6,armhf,arm64} ${TOP}/bin
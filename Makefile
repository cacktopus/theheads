BUILDX=DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build
BUILD=docker build

.PHONY: build-arm
build-arm:
	$(BUILDX) --load --platform linux/arm/v7 --tag heads-build-arm -f arm/Dockerfile.build-arm .

.PHONY: build-arm64
build-arm64:
	$(BUILDX) --load --platform linux/arm64/v8 --tag heads-build-arm64 -f arm/Dockerfile.build-arm64 .

.PHONY: build-armv6
build-armv6:
	$(BUILDX) --load --platform linux/arm/v6 --tag heads-build-armv6 -f arm/Dockerfile.build-armv6 .

.PHONY: build-amd64
build-amd64:
	$(BUILDX) --load --platform linux/amd64 --tag heads-build-amd64 -f arm/Dockerfile.build-amd64 .

.PHONY: %-arm
%-arm:
	time $(BUILD) --tag $*-arm -f $*/Dockerfile.arm .
	docker cp `docker container create $*-arm`:/build/$*_0.0.0_armhf.tar.gz .
	shasum -a 256 $*_0.0.0_armhf.tar.gz

.PHONY: %-arm64
%-arm64:
	time $(BUILD) --tag $*-arm64 -f $*/Dockerfile.arm64 .
	docker cp `docker container create $*-arm64`:/build/$*_0.0.0_arm64.tar.gz .
	shasum -a 256 $*_0.0.0_arm64.tar.gz

.PHONY: %-armv6
%-armv6:
	time $(BUILD) --tag $*-armv6 -f $*/Dockerfile.armv6 .
	docker cp `docker container create $*-armv6`:/build/$*_0.0.0_armv6.tar.gz .
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

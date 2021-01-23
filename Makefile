BUILDX=DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build
FLAGS=--load --platform linux/arm/v7
BUILD=docker build

.PHONY: docker-build
docker-build:
	$(BUILDX) $(FLAGS) --tag heads-build-common -f arm/Dockerfile.build-common .

.PHONY: %-arm
%-arm:
	time $(BUILD) --tag $*-arm -f arm/Dockerfile.$* .
	docker cp `docker container create $*-arm`:/pkg/$*.tar.gz ./$*.tar.gz
	shasum -a 256 $*.tar.gz

.PHONY: camera
camera:
	$(BUILD) --tag camera -f Dockerfile.camera.all .

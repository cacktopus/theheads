.PHONY: protos
protos:
	docker run -i --rm -v "$$(pwd)":"$$(pwd)" -w "$$(pwd)" heads-protoc /bin/protoc --proto_path=./protos --go_out=plugins=grpc,paths=source_relative:./gen/go/heads ./protos/*.proto

heads-protoc:
	docker build --tag heads-protoc protos
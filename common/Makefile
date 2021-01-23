



.PHONY: protos
protos:
	PATH=${PATH}:${HOME}/go/bin protoc --proto_path=./protos --go_out=plugins=grpc,paths=source_relative:./gen/go/heads ./protos/*.proto

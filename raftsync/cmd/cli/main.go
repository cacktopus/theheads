package main

import (
	"context"
	"fmt"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
	"raftdemo/gen/raft"
)

const chunkSize = 256 * 1024

type uploader struct {
	client raft.RaftClient
	dst    string
}

func (u *uploader) uploadFile(prefix, filename string) {
	localFilePath := filepath.Join(prefix, filename)

	fmt.Println("opening", localFilePath)
	content, err := ioutil.ReadFile(localFilePath)
	if err != nil {
		panic(errors.Wrap(err, "opening "+localFilePath))
	}

	pos := int64(0)
	id := int64(0)
	for len(content) > 0 {

		sz := chunkSize
		if sz > len(content) {
			sz = len(content)
		}

		dst := filepath.Join(u.dst, filename)

		fmt.Println("dst", dst)

		chunk := &raft.FileChunk{
			Filename: dst,
			Id:       id,
			Pos:      pos,
			Content:  content[:sz],
		}

		fmt.Println(chunk.Id, chunk.Filename, chunk.Pos, len(chunk.Content))

		_, err := u.client.Upload(context.Background(), chunk)
		if err != nil {
			panic(err)
		}

		content = content[sz:]
		pos += int64(sz)
		id++
	}
}

func (u *uploader) upload(prefix, path string) {
	localFull := filepath.Join(prefix, path)
	stat, err := os.Stat(localFull)
	if err != nil {
		panic(err)
	}

	if stat.IsDir() {
		files, err := ioutil.ReadDir(localFull)
		if err != nil {
			panic(err)
		}
		for _, d := range files {
			u.upload(prefix, filepath.Join(path, d.Name()))
		}
	} else {
		u.uploadFile(prefix, path)
	}
}

func main() {
	cmd := os.Args[1]
	args := os.Args[2:]

	switch cmd {
	case "put":
		dst := args[len(args)-1]

		url, err := url.Parse(dst)
		if err != nil {
			panic(err)
		}

		args = args[:len(args)-1]
		_ = args[0] // lazy way to make sure we have at least one file

		conn, err := grpc.Dial(url.Host, grpc.WithInsecure())
		if err != nil {
			panic(err)
		}

		client := raft.NewRaftClient(conn)

		u := uploader{
			client: client,
			dst:    url.Path,
		}

		for _, filename := range args {
			prefix, file := filepath.Split(filename)
			u.upload(prefix, file)
		}

	default:
		panic("unknown command: " + cmd)
	}
}

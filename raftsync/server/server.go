package server

import (
	"context"
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"io"
	"net"
	"os"
	"path/filepath"
	gen "raftsync/gen/raft"
	"strings"
)

const (
	maxChunkSize = 256 * 1024

	rpcAddr  = 9001
	httpAddr = 9000
)

type Cfg struct {
	Host    string `envconfig:"optional"`
	DataDir string `envconfig:"optional"`
	Hosts   []string
	Buckets []string
}

type handler struct {
	dataDir  string
	nodeId   int
	allNodes *nodes
}

func (h *handler) Finish(ctx context.Context, in *gen.FinishIn) (*gen.Empty, error) {
	stagingFile := filepath.Join(h.dataDir, "staging", in.StagingUuid)
	dstFile := filepath.Join(h.dataDir, "fs", in.Bucket, in.Key)
	dir := filepath.Dir(dstFile)
	err := os.MkdirAll(dir, 0o755)
	if err != nil {
		return nil, errors.Wrap(err, "make directories")
	}
	fmt.Println("rename", stagingFile, dstFile)
	err = os.Rename(stagingFile, dstFile)
	if err != nil {
		return nil, errors.Wrap(err, "rename")
	}
	return &gen.Empty{}, nil
}

func (h *handler) PartialUpload(ctx context.Context, chunk *gen.FileChunk) (*gen.Empty, error) {
	//TODO: prevent ".." attacks and similar
	staging := filepath.Join(h.dataDir, "staging")
	err := os.MkdirAll(staging, 0o755)
	if err != nil {
		return nil, errors.Wrap(err, "create staging dir")
	}

	path := filepath.Join(staging, chunk.Uuid)
	path = strings.TrimPrefix(filepath.Clean(path), "/")

	fmt.Println(chunk.Uuid, chunk.Id, chunk.Filename, chunk.Pos, len(chunk.Content))

	file, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE, 0o640)
	if err != nil {
		return nil, errors.Wrap(err, "open file")
	}
	defer file.Close()

	_, err = file.Seek(chunk.Pos, io.SeekStart)
	if err != nil {
		return nil, errors.Wrap(err, "seek")
	}

	_, err = file.Write(chunk.Content)
	if err != nil {
		return nil, errors.Wrap(err, "write")
	}

	return &gen.Empty{}, nil
}

func (h *handler) Head(ctx context.Context, in *gen.HeadIn) (*gen.HeadOut, error) {
	dstFile := filepath.Join(h.dataDir, "fs", in.Filename)
	stat, err := os.Stat(dstFile)
	switch err.(type) {
	case nil:
		if stat.IsDir() {
			return &gen.HeadOut{Size: -1, Ok: false}, nil
		}
		return &gen.HeadOut{Size: stat.Size(), Ok: true}, nil
	case *os.PathError:
		return &gen.HeadOut{Size: -1, Ok: false}, nil
	default:
		return nil, errors.Wrap(err, "stat")
	}
}

func RunServer(cfg *Cfg) {
	if cfg.DataDir != "" {
		err := os.MkdirAll(cfg.DataDir, 0o750)
		if err != nil {
			panic(err)
		}

	}

	nodes := newNodes(cfg.Hosts, cfg.Host)

	fmt.Println("nodes are", cfg.Hosts)

	me := nodes.me()

	fmt.Println("nodes", spew.Sdump(nodes))

	h := &handler{
		allNodes: nodes,
		dataDir:  cfg.DataDir,
	}

	s := grpc.NewServer()
	gen.RegisterRaftServer(s, h)
	reflection.Register(s)

	listener, err := net.Listen("tcp", me.rpcAddr())
	if err != nil {
		panic(err)
	}

	go s.Serve(listener)

	go serveHTTP(cfg.DataDir, me.httpAddr(), cfg.Buckets, h)

	select {}
}

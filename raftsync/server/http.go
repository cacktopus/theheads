package server

import (
	"context"
	"encoding/xml"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"google.golang.org/grpc"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"raftsync/gen/raft"
	"reflect"
	"strings"
)

type Bucket struct {
	XMLName xml.Name `xml:"Bucket"`

	CreationDate string
	Name         string
}

type Owner struct {
	DisplayName string
	ID          string
}

type JsonError struct {
	Err string `json:"err"`
}

type ListAllMyBucketsResult struct {
	Buckets []*Bucket `xml:"Buckets>Bucket"`
}

func serveHTTP(datadir string, addr string, buckets []string, h *handler) {
	router := gin.Default()

	//router.GET("/hello", func(c *gin.Context) {
	//	c.String(http.StatusOK, "hello %s", c.FullPath())
	//})

	storageDir := filepath.Join(datadir, "fs")

	var bucketList []*Bucket

	for _, bucket := range buckets {
		bucketPath := filepath.Join(storageDir, bucket)
		err := os.MkdirAll(bucketPath, 0o755)
		if err != nil {
			panic(err)
		}

		bucketList = append(bucketList, &Bucket{
			Name:         bucket,
			CreationDate: "2006-01-02T15:04:05.999999999Z",
		})
	}

	router.GET("/", func(c *gin.Context) {
		result := &ListAllMyBucketsResult{
			Buckets: bucketList,
		}
		c.Header("content-type", "application/xml; charset=utf-8")
		c.Status(http.StatusOK)

		c.Writer.Write([]byte(`<?xml version="1.0" encoding="UTF-8"?>` + "\r\n"))

		bytes, err := xml.MarshalIndent(result, "", "  ")
		if err != nil {
			panic(err)
		}
		c.Writer.Write(bytes)
	})

	// list all files in bucket
	router.GET("/:path1", func(c *gin.Context) {
		bucket, ok := c.Params.Get("path1")
		if !ok {
			c.IndentedJSON(http.StatusNotFound, &JsonError{Err: "no bucket"})
			return
		}

		if bucket == "health" {
			c.String(http.StatusOK, "OK")
			return
		}

		if bucket == "metrics" {
			promhttp.Handler().ServeHTTP(c.Writer, c.Request)
			return
		}

		for k, v := range c.Request.Header {
			if len(v) != 1 {
				c.IndentedJSON(http.StatusNotFound, &JsonError{Err: "invalid header"})
				return
			}
			fmt.Println(k, v[0])
		}

		prefix := c.Query("prefix")

		bucketPath := filepath.Join(storageDir, bucket)
		queryPath := filepath.Join(bucketPath, prefix)

		var contents []*Contents
		var commonPrefixes []*CommonPrefix

		withDelimiter := func() error {
			files, err := ioutil.ReadDir(queryPath)
			if err != nil {
				pathError, ok := err.(*os.PathError)
				if ok && strings.Contains(pathError.Error(), "no such file or directory") {
					return nil
				}

				return errors.Wrap(err, "read dir: "+reflect.TypeOf(err).String())
			}

			for _, file := range files {
				path := filepath.Join(queryPath, file.Name())
				stat, err := os.Stat(path)
				if err != nil {
					return errors.Wrap(err, "stat")
				}

				relative, err := filepath.Rel(bucketPath, path)
				if err != nil {
					return errors.Wrap(err, "calculate relative path")
				}

				if stat.IsDir() {
					commonPrefixes = append(commonPrefixes, &CommonPrefix{
						Prefix: relative + "/",
					})
				} else {
					contents = append(contents, &Contents{
						Key:          relative,
						LastModified: "2006-01-02T15:04:05.999999999Z",
						Size:         stat.Size(),
					})
				}
			}

			return nil
		}

		withoutDelimiter := func() error {
			err := filepath.Walk(queryPath, func(path string, info os.FileInfo, err error) error {
				if err != nil {
					// TODO: handle notfound case as 404
					return err
				}

				if info.IsDir() {
					return nil
				}

				relative, err := filepath.Rel(bucketPath, path)
				if err != nil {
					return errors.Wrap(err, "calculate relative path")
				}

				contents = append(contents, &Contents{
					Key:          relative,
					LastModified: "2006-01-02T15:04:05.999999999Z",
					Size:         info.Size(),
				})

				return nil
			})
			return errors.Wrap(err, "walk")
		}

		delimeter := c.Query("delimiter")
		var err error
		switch delimeter {
		case "":
			err = errors.Wrap(withoutDelimiter(), "without delimiter")
		case "/":
			err = errors.Wrap(withDelimiter(), "with delimiter")
		default:
			err := errors.New("Unexpected delimiter")
			c.Error(err)
			c.IndentedJSON(http.StatusBadRequest, &JsonError{Err: err.Error()})
			return
		}

		if err != nil {
			c.Error(err)
			c.IndentedJSON(http.StatusBadRequest, &JsonError{Err: err.Error()})
			return
		}

		result := &ListBucketResult{
			Contents:       contents,
			CommonPrefixes: commonPrefixes,
		}

		c.Header("content-type", "application/xml; charset=utf-8")
		c.Status(http.StatusOK)

		c.Writer.Write([]byte(`<?xml version="1.0" encoding="UTF-8"?>` + "\r\n"))
		bytes, err := xml.MarshalIndent(result, "", "  ")
		if err != nil {
			err = errors.Wrap(err, "marshal xml")
			c.IndentedJSON(http.StatusInternalServerError, &JsonError{Err: err.Error()})
		}
		c.Writer.Write(bytes)
	})

	router.GET("/:path1/*path2", func(c *gin.Context) {
		for k, v := range c.Request.Header {
			if len(v) != 1 {
				panic("no")
			}
			fmt.Println(k, v[0])
		}

		body, err := c.GetRawData()
		if err != nil {
			panic(err)
		}
		fmt.Println("body", string(body))

		//c.Header("content-type", "application/xml; charset=utf-8")
		c.Status(http.StatusOK)

		bucket, ok := c.Params.Get("path1")
		if !ok {
			panic("no bucket")
		}

		bucketDir := filepath.Join(storageDir, bucket)

		key, _ := c.Params.Get("path2")

		filename := filepath.Join(bucketDir, key)

		file, err := os.Open(filename)
		if err != nil {
			panic(err)
		}
		defer file.Close()

		_, err = io.Copy(c.Writer, file)
		if err != nil {
			panic(err)
		}
	})

	router.HEAD("/:path1/*path2", func(c *gin.Context) {
		bucket, ok := c.Params.Get("path1")
		if !ok {
			panic("no bucket")
		}
		key, _ := c.Params.Get("path2")
		filename := filepath.Join(bucket, key)

		var clients []raft.RaftClient

		for _, node := range h.allNodes.nodes {
			addr := node.rpcAddr()
			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			defer conn.Close()
			if err != nil {
				c.Status(http.StatusServiceUnavailable)
				return
			}
			client := raft.NewRaftClient(conn)
			clients = append(clients, client)
		}

		var head *raft.HeadOut
		for _, client := range clients {
			var err error
			head, err = client.Head(context.Background(), &raft.HeadIn{Filename: filename})
			if err != nil {
				fmt.Println(errors.Wrap(err, "head"))
			}

			if head.Ok {
				break
			}
		}

		if head != nil && head.Ok {
			c.Status(http.StatusOK)
			c.Header("Last-Modified", "Wed, 21 Oct 2015 07:28:00 GMT")
			c.Header("Content-Length", fmt.Sprintf("%d", head.Size))
			return
		} else {
			c.Status(http.StatusNotFound)
			return
		}
	})

	router.PUT("/:path1/*path2", func(c *gin.Context) {
		bucket, ok := c.Params.Get("path1")
		if !ok {
			panic("no bucket")
		}
		key, _ := c.Params.Get("path2")
		filename := filepath.Join(bucket, key)

		uuid := uuid.New().String()

		var clients []raft.RaftClient

		for _, node := range h.allNodes.nodes {
			addr := node.rpcAddr()
			conn, err := grpc.Dial(addr, grpc.WithInsecure())
			defer conn.Close()
			if err != nil {
				c.Status(http.StatusServiceUnavailable)
				return
			}
			client := raft.NewRaftClient(conn)
			clients = append(clients, client)
		}

		done := false
		pos := 0
		id := 0
		for !done {
			var chunk [maxChunkSize]byte
			n, err := io.ReadFull(c.Request.Body, chunk[:])
			switch err {
			case nil:
			case io.ErrUnexpectedEOF:
				done = true
			default:
				c.Status(http.StatusInternalServerError)
				return
			}

			for i, client := range clients {
				chunk := &raft.FileChunk{
					Uuid:     uuid,
					Filename: filename,
					Id:       int64(id),
					Pos:      int64(pos),
					Size:     int64(n),
					Content:  chunk[:n],
				}

				fmt.Println(i, client, chunk.Pos, chunk.Pos+chunk.Size)

				_, err := client.PartialUpload(context.Background(), chunk)
				if err != nil {
					c.Status(http.StatusServiceUnavailable)
					return
				}
			}

			id++
			pos += n
		}

		for _, client := range clients {
			_, err := client.Finish(context.Background(), &raft.FinishIn{
				StagingUuid: uuid,
				Bucket:      bucket,
				Key:         key,
				Size:        int64(pos),
			})
			if err != nil {
				c.Status(http.StatusServiceUnavailable)
				return
			}
		}

	})

	router.NoRoute(func(c *gin.Context) {
		for k, v := range c.Request.Header {
			if len(v) != 1 {
				panic("no")
			}
			fmt.Println(k, v[0])
		}
		c.String(http.StatusNotFound, "notfound %s", c.Request.URL.Path)
	})

	router.Run(addr)
}

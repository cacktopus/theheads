package head_manager

import (
	"google.golang.org/grpc"
	"net/url"
	"strings"
)

type Connection struct {
	Conn       *grpc.ClientConn
	URI        string
	Addr       string
	connectErr error
}

func (c *Connection) Service() string {
	parse, _ := url.Parse(c.URI)
	return parse.Scheme
}

func (c *Connection) PathParts() []string {
	parse, _ := url.Parse(c.URI)
	return append(
		[]string{parse.Host},
		strings.Split(parse.Path, "/")...,
	)
}

func (c *Connection) Instance() string {
	parts := c.PathParts()
	return parts[len(parts)-1]
}

func NewConnection(URI string) *Connection {
	return &Connection{
		URI: URI,
	}
}

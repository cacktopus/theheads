package util

import (
	"net"
	"strconv"
)

func RandomPort() int {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	result := listener.Addr().String()
	_, portStr, err := net.SplitHostPort(result)
	if err != nil {
		panic(err)
	}
	err = listener.Close()
	if err != nil {
		panic(err)
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		panic(err)
	}
	return port
}

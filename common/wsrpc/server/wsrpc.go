package server

import (
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net"
	"net/rpc"
	"reflect"
)

func ManageWebsocket(logger *zap.Logger, conn *websocket.Conn) (*rpc.Client, error) {
	c1, c2 := net.Pipe()

	// TODO: remove all panics in here

	go func() {
		buf := make([]byte, 16*1024)
		for {
			n, err := c2.Read(buf)
			err = conn.WriteMessage(websocket.BinaryMessage, buf[:n])
			if err != nil {
				logger.Info(
					"write to websocket failed",
					zap.Error(err),
					zap.String("error_type", reflect.TypeOf(err).String()),
				)
				c2.Close()
				return
			}
		}
	}()

	go func() {
		for {
			_, buf, err := conn.ReadMessage() // TODO assert message kind
			if err != nil {
				var closeError *websocket.CloseError
				if errors.As(err, &closeError) {
					logger.Info("remote close")
					c2.Close()
					return
				}
			}
			_, err = c2.Write(buf)
			if err != nil {
				panic(err)
			}
		}
	}()

	client := rpc.NewClient(c1)
	return client, nil
}

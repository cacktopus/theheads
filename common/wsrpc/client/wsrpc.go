package client

import (
	"fmt"
	"net"
	"net/rpc"
	"syscall/js"
)

type Client struct {
	c1, c2 net.Conn
	server *rpc.Server
	wsURL  string
}

func New(wsURL string) *Client {
	return &Client{
		wsURL:  wsURL,
		server: rpc.NewServer(),
	}
}

func (c *Client) Connect() {
	ws := js.Global().Get("WebSocket").New(c.wsURL)

	c.c1, c.c2 = net.Pipe()

	ws.Set("binaryType", "arraybuffer")
	ws.Call("addEventListener", "open", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Println("open")
		return nil
	}))

	ws.Call("addEventListener", "message", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		event := args[0]
		//fmt.Println("data: " + event.Get("data").Type().String())
		arr := js.Global().Get("Uint8Array").New(event.Get("data"))
		buf := make([]byte, arr.Length())
		js.CopyBytesToGo(buf, arr)
		//fmt.Println("copied bytes:", n)
		_, err := c.c1.Write(buf)
		if err != nil {
			panic(err)
		}
		return nil
	}))

	go func() {
		buf := make([]byte, 16*1024)
		for {
			n, err := c.c1.Read(buf)
			if err != nil {
				panic(err)
			}
			arr := js.Global().Get("Uint8Array").New(n)
			js.CopyBytesToJS(arr, buf[:n]) // TODO: assert number of bytes copied is correct
			ws.Call("send", arr)
		}
	}()

	go c.server.ServeConn(c.c2)
}

func (c *Client) Register(rcvr interface{}) error {
	return c.server.Register(rcvr)
}

package main

import (
	"fmt"
	"github.com/cacktopus/theheads/common/wsrpc/client"
	"syscall/js"
	"time"
)

type Log struct {
	Date time.Time `json:"date"`
}

type Reply struct{}

type Logger struct {
	st *scrollingTable
}

func (s *Logger) PrintLog(log *Log, reply *Reply) error {
	s.st.appendRow([]string{
		log.Date.Format("2006-01-02"),
		log.Date.Format("15:04:05"),
	})
	reply = &Reply{}
	return nil
}

func main() {
	fmt.Println("Hello, WebAssembly!")

	document := js.Global().Get("document")

	wsclient := client.New("ws://localhost/ws")
	err := wsclient.Register(&Logger{
		st: newScrollingTable(document, []string{"date", "time"}),
	})

	if err != nil {
		panic(err)
	}

	wsclient.Connect()

	select {}
}

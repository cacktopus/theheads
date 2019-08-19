package main

import (
	"encoding/json"
	"github.com/cacktopus/heads/boss/broker"
	"github.com/gorilla/websocket"
)

func manageWebsocket(conn *websocket.Conn, msgBroker *broker.Broker) {
	msgs := msgBroker.Subscribe()

	for {
		//type_, msg, err := conn.ReadMessage()
		//if err != nil {
		//	break
		//}
		//conn.WriteMessage(type_, msg)
		//log.Println("ws", type_, string(msg))

		for m := range msgs {
			switch msg := m.(type) {
			case broker.HeadPositioned, broker.MotionLine, broker.FocalPoints:
				data, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}

				events := []broker.HeadEvent{{
					Type: msg.Name(),
					Data: data,
				}}

				payload, err := json.Marshal(events)
				if err != nil {
					panic(err)
				}
				conn.WriteMessage(1, payload)
			}
		}
	}
}
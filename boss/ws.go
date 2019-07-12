package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
)

func manageWebsocket(conn *websocket.Conn, broker *Broker) {
	msgs := broker.Subscribe()

	for {
		//type_, msg, err := conn.ReadMessage()
		//if err != nil {
		//	break
		//}
		//conn.WriteMessage(type_, msg)
		//log.Println("ws", type_, string(msg))

		for m := range msgs {
			switch msg := m.(type) {
			// TODO: need to translate MotionDetected to "motion-line"
			case HeadPositioned, MotionLine:
				data, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}

				events := []HeadEvent{{
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

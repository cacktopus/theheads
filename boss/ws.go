package boss

import (
	"encoding/json"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/gorilla/websocket"
)

func manageWebsocket(conn *websocket.Conn, msgBroker *broker.Broker) {
	msgs := msgBroker.Subscribe()

	for {
		for m := range msgs {
			switch msg := m.(type) {
			case broker.HeadPositioned, schema.MotionLine, schema.FocalPoints, schema.Active:
				data, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}

				events := []schema.HeadEvent{{
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

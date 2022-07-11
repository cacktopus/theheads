package boss

import (
	"encoding/json"
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/wsrpc/server"
	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func manageWebsocket(conn *websocket.Conn, msgBroker *broker.Broker) {
	msgs := msgBroker.Subscribe()

	for {
		for m := range msgs {
			switch msg := m.(type) {
			case *schema.HeadPositioned, *schema.FocalPoints, *schema.Active:
				data, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}

				events := []schema.Event{{
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

func manageWebsocket2(
	logger *zap.Logger,
	conn *websocket.Conn,
	msgBroker *broker.Broker,
) error {
	msgs := msgBroker.Subscribe()

	client, err := server.ManageWebsocket(logger, conn)
	if err != nil {
		return errors.Wrap(err, "manage")
	}
	defer client.Close()

	for {
		for m := range msgs {
			switch msg := m.(type) {
			case *schema.HeadPositioned:
				empty := &struct{}{}
				err := client.Call("Draw.HeadPositioned", msg, &empty)
				if err != nil {
					return errors.Wrap(err, "remote call")
				}
			case *schema.MotionDetected:
				empty := &struct{}{}
				err := client.Call("Draw.MotionDetected", msg, &empty)
				if err != nil {
					return errors.Wrap(err, "remote call")
				}
			case *schema.FocalPoints:
				empty := &struct{}{}
				err := client.Call("Draw.FocalPoints", msg, &empty)
				if err != nil {
					return errors.Wrap(err, "remote call")
				}
			}
		}
	}
}

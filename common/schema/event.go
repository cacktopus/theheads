package schema

import "encoding/json"

type Event struct {
	Type string
	Data json.RawMessage
}

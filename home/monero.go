package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"reflect"
)

type MetricsResponse struct {
	Result struct {
		DatabaseSize             int64 `json:"database_size"`
		FreeSpace                int64 `json:"free_space"`
		Height                   int64 `json:"height"`
		IncomingConnectionsCount int64 `json:"incoming_connections_count"`
		OutgoingConnectionsCount int64 `json:"outgoing_connections_count"`
		RPCConnectionsCount      int64 `json:"rpc_connections_count"`
		TargetHeight             int64 `json:"target_height"`
		TxCount                  int64 `json:"tx_count"`
		TxPoolSize               int64 `json:"tx_pool_size"`
	} `json:"result"`
}

func moneroMetrics(res http.ResponseWriter, req *http.Request) {
	body := bytes.NewBuffer([]byte(
		`{"jsonrpc": "2.0", "id": "0", "method": "get_info"}`,
	))

	res2, err := http.Post(
		"http://127.0.0.1:18081/json_rpc",
		"application/json",
		body,
	)

	if err != nil {
		res.WriteHeader(502)
		return
	}

	defer res2.Body.Close()

	body2, err := ioutil.ReadAll(res2.Body)
	if err != nil {
		res.WriteHeader(502)
		return
	}

	metricsResponse := MetricsResponse{}

	err = json.Unmarshal(body2, &metricsResponse)
	if err != nil {
		res.WriteHeader(502)
		return
	}

	fields := reflect.TypeOf(metricsResponse.Result)
	values := reflect.ValueOf(metricsResponse.Result)
	for i := 0; i < fields.NumField(); i++ {
		field := fields.Field(i)
		value := values.Field(i)
		fmt.Fprintf(res, "# TYPE monero_%s gauge\n", field.Tag.Get("json"))
		fmt.Fprintf(res, "monero_%s %d\n\n", field.Tag.Get("json"), value.Int())
	}
}

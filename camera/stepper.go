package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

var positions = make(chan int, 256)

func send(pos int) {
	url := fmt.Sprintf(
		"http://192.168.42.30:8080/position/%d?speed=25",
		pos,
	)
	fmt.Println(url)
	resp, err := http.Get(url)
	if err != nil {
		panic(err) // TODO
	}
	defer resp.Body.Close()
	_, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
}

func sendToStepper() {
	for {
		// first wait for a position
		pos := <-positions
		// burn any other positions in the queue
	loop:
		for {
			select {
			case pos = <-positions:
			default:
				break loop
			}
		}
		send(pos)
		time.Sleep(25 * time.Millisecond)
	}
}

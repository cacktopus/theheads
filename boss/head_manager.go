package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
)

const (
	defaultConsulEndpoint = "http://127.0.0.1:8500"
)

type HeadQueue struct {
	serviceName  string
	tagName      string
	queue        chan string
	consulClient *http.Client
	headClient   *http.Client
}

func NewHeadQueue(serviceName, tagName string) *HeadQueue {
	return &HeadQueue{
		serviceName:  serviceName,
		tagName:      tagName,
		queue:        make(chan string, 64),
		consulClient: &http.Client{},
		headClient:   &http.Client{},
	}
}

type consulServiceMessage struct {
	Address     string
	ServicePort int
}

func (h *HeadQueue) lookupServiceURL(path string) string {
	queryString := fmt.Sprintf("tag=%s", h.tagName)

	// assert path starts with /

	consulUrl := fmt.Sprintf("%s%s%s?%s",
		defaultConsulEndpoint,
		"/v1/catalog/service/",
		h.serviceName,
		queryString,
	)

	resp, err := h.consulClient.Get(consulUrl)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()

	//TODO: resp.status

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	var results []*consulServiceMessage

	err = json.Unmarshal(body, &results)
	if err != nil {
		panic(err)
	}

	if len(results) == 0 {
		panic("no services registered")
	}

	if len(results) > 1 {
		panic("too many services registered")
	}

	return fmt.Sprintf("http://%s:%d%s", results[0].Address, results[0].ServicePort, path)
}

func (h *HeadQueue) send(url string) {
	resp, err := h.headClient.Get(url)
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	defer resp.Body.Close()

	//TODO: resp.status
	_, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
}

func (h *HeadQueue) sendLoop() {
	for path := range h.queue {
		// TODO: dedup/ratelimit
		url := h.lookupServiceURL(path)
		h.send(url)
	}
}

type HeadManager struct {
	queues map[string]*HeadQueue
	lock   sync.Mutex
}

func NewHeadManager() *HeadManager {
	return &HeadManager{
		queues: map[string]*HeadQueue{},
	}
}

func (h *HeadManager) getQueue(serviceName, headName string) *HeadQueue {
	key := fmt.Sprintf("%s::%s", serviceName, headName)

	h.lock.Lock()
	defer h.lock.Unlock()

	queue, ok := h.queues[key]

	if !ok {
		queue = NewHeadQueue(serviceName, headName)
		h.queues[key] = queue
		go queue.sendLoop()
	}

	return queue
}

func (h *HeadManager) send(serviceName, headName, path string) {
	queue := h.getQueue(serviceName, headName)
	queue.queue <- path
}

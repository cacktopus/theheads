package main

import (
	"fmt"
	"github.com/cacktopus/heads/boss/config"
	consulapi "github.com/hashicorp/consul/api"
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
	consulClient *consulapi.Client
	headClient   *http.Client
}

func NewHeadQueue(serviceName, tagName string) *HeadQueue {
	return &HeadQueue{
		serviceName:  serviceName,
		tagName:      tagName,
		queue:        make(chan string, 64),
		consulClient: config.NewClient(),
		headClient:   &http.Client{},
	}
}

func (h *HeadQueue) lookupServiceURL(path string) string {
	services, err := config.AllServiceURLs(h.consulClient,
		h.serviceName,
		h.tagName,
		"http://",
		path,
	)

	if err != nil {
		panic(err)
	}

	if len(services) != 1 {
		panic("Not enough or too many services for " + h.serviceName + ":" + h.tagName)
	}

	return services[0]
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

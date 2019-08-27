package main

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/heads/boss/config"
	consulapi "github.com/hashicorp/consul/api"
	"github.com/pkg/errors"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"sync"
)

const (
	defaultConsulEndpoint = "http://127.0.0.1:8500"
)

type Result struct {
	Err        error
	Body       []byte
	StatusCode int
}

type SendItem struct {
	path   string
	result chan Result
}

type HeadQueue struct {
	serviceName  string
	tagName      string
	queue        chan SendItem
	consulClient *consulapi.Client
	headClient   *http.Client
}

func NewHeadQueue(serviceName, tagName string) *HeadQueue {
	return &HeadQueue{
		serviceName:  serviceName,
		tagName:      tagName,
		queue:        make(chan SendItem, 64),
		consulClient: config.NewClient(),
		headClient:   &http.Client{},
	}
}

func (h *HeadQueue) lookupServiceURL(path string) (string, error) {
	services, err := config.AllServiceURLs(h.consulClient,
		h.serviceName,
		h.tagName,
		"http://",
		path,
	)

	if err != nil {
		return "", err
	}

	if len(services) != 1 {
		return "", errors.New(fmt.Sprintf("%d services found for %s:%s",
			len(services), h.serviceName, h.tagName))
	}

	return services[0], nil
}

func (h *HeadQueue) send(url string) Result {
	log.WithField("url", url).Debug("sending")
	resp, err := h.headClient.Get(url)
	if err != nil {
		return Result{Err: err}
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return Result{Err: errors.New("received non-200 status code")}
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return Result{Err: err}
	}

	return Result{Body: body, StatusCode: resp.StatusCode}
}

func (h *HeadQueue) sendLoop() {
loop:
	for item := range h.queue {
		// TODO: dedup/ratelimit
		url, err := h.lookupServiceURL(item.path)
		if err != nil {
			log.WithError(err).Error("error looking up service")
			if item.result != nil {
				item.result <- Result{Err: err}
				continue loop
			}
		}

		result := h.send(url)
		if result.Err != nil {
			log.WithError(result.Err).Error("error sending to service")
		}

		if item.result != nil {
			item.result <- result
			continue loop
		}
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

func (h *HeadManager) sendWithResult(serviceName, headName, path string, unpack interface{}) Result {
	resultChan := make(chan Result)

	queue := h.getQueue(serviceName, headName)
	queue.queue <- SendItem{path, resultChan}

	result := <-resultChan

	if result.Err != nil {
		return result
	}

	if unpack != nil {
		err := json.Unmarshal(result.Body, unpack)
		if err != nil {
			return Result{Err: err}
		}
	}

	return result
}

func (h *HeadManager) send(serviceName, headName, path string) {
	queue := h.getQueue(serviceName, headName)
	queue.queue <- SendItem{path, nil}
}

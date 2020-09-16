package main

import (
	"encoding/json"
	"github.com/cacktopus/theheads/boss/config"
	"github.com/gin-gonic/gin"
	"github.com/hashicorp/consul/api"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"io/ioutil"
	"math"
	"net/http"
	"sort"
	"syscall"
	"time"
)

const addr = ":8086"

func now() float64 {
	t := time.Now().UnixNano()
	return float64(t) / float64(time.Second)
}

var currentTimestamp = prometheus.NewGaugeFunc(prometheus.GaugeOpts{
	Namespace: "heads",
	Subsystem: "timesync",
	Name:      "current_timestamp",
}, now)

func init() {
	prometheus.MustRegister(currentTimestamp)
}

type Time struct {
	T float64
}

func synctime(client *api.Client) error {
	urls, err := config.AllServiceURLs(
		client,
		"timesync",
		"rtc",
		"http://",
		"/time",
	)

	if err != nil {
		return err
	}

	var values []float64

	for _, url := range urls {
		client := &http.Client{
			Timeout: 500 * time.Millisecond,
		}
		resp, err := client.Get(url)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return err
		}
		var t Time
		json.Unmarshal(body, &t)
		values = append(values, t.T)
	}

	if len(values) < 2 {
		logrus.Warn("Less than two clock sources found")
		return nil
	}

	sort.Float64s(values)
	min := values[0]
	max := values[len(values)-1]

	rtcDelta := max - min

	if rtcDelta > 5.0 {
		logrus.WithField("rtcDelta", rtcDelta).Warn("Clock source (RTC) delta is too large")
		return nil
	}

	localDelta := math.Abs(now() - max)
	if localDelta < 5.0 {
		logrus.WithField("localDelta", localDelta).Info("Local clock is fine, not changing")
		return nil
	}

	whole, frac := math.Modf(max)
	tv := syscall.Timeval{
		Sec:  int32(whole),
		Usec: int32(frac * 1e6),
	}

	logrus.
		WithField("localDelta", localDelta).
		WithField("sec", tv.Sec).
		WithField("usec", tv.Usec).
		Info("Setting time")

	if err = syscall.Settimeofday(&tv); err != nil {
		logrus.WithError(err).Error("Error setting time")
		return err
	}

	return nil
}

func main() {
	r := gin.New()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	r.GET("/time", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"t": now(),
		})
	})

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	go func() {
		client := config.NewClient("127.0.0.1:8500")
		for {
			synctime(client)
			time.Sleep(15 * time.Second)
		}
	}()

	go func() {
		r.Run(addr)
	}()

	select {}
}

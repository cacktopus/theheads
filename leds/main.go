package main

import (
	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

const (
	timeDelta         = time.Millisecond * 3
	defaultNumLeds    = 74
	defaultStartIndex = 10
)

func setup() *Strip {
	strNumLeds, ok := os.LookupEnv("NUM_LEDS")
	numLeds := defaultNumLeds

	if ok {
		var err error
		numLeds, err = strconv.Atoi(strNumLeds)
		if err != nil {
			panic(err)
		}
	}

	strStartIndex, ok := os.LookupEnv("START_INDEX")
	startIndex := defaultStartIndex
	if ok {
		var err error
		startIndex, err = strconv.Atoi(strStartIndex)
		if err != nil {
			panic(err)
		}
	}

	conn := SetupSPI()
	strip := NewStrip(numLeds, startIndex, 5.0*74.0/150.0, conn)

	// reset
	strip.send()

	return strip
}

func runLeds(strip *Strip, animations map[string]callback, ch <-chan callback, done <-chan bool) {
	startTime := time.Now()
	t0 := startTime

	var animation = "rainbow"

	if a, ok := os.LookupEnv("ANIMATION"); ok {
		animation = a
	}

	cb := animations[animation]

loop:
	for {
		select {
		case new_cb := <-ch:
			startTime = time.Now()
			cb = new_cb
		case <-time.After(timeDelta):
			now := time.Now()
			t := now.Sub(startTime).Seconds()

			dt := now.Sub(t0).Seconds()
			dt = timeDelta.Seconds() // TODO: remove

			cb(strip, t, dt)
			t0 = now
			strip.send()
		case <-done:
			break loop
		}
	}

	// cleanup: set to low red
	strip.Each(func(_ int, led *Led) {
		led.r = 0.10
		led.g = 0
		led.b = 0
	})

	strip.send()
}

func main() {
	strip := setup()

	var animations = map[string]callback{
		"rainbow": rainbow(strip),
		"decay":   decay,
		"lowred":  lowred,
		"bounce":  Bounce().Tick,
		"off":     off,
	}

	addr := ":8082"
	ch := make(chan callback)

	r := gin.New()
	r.Use(
		gin.LoggerWithWriter(gin.DefaultWriter, "/metrics", "/health"),
		gin.Recovery(),
	)

	r.GET("/health", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.GET("/run/:name", func(c *gin.Context) {
		name := c.Param("name")
		fn, ok := animations[name]
		if ok {
			ch <- fn
			c.Header("Access-Control-Allow-Origin", "*")
			c.JSON(200, gin.H{"result": "ok"})
		}
	})

	go func() {
		r.Run(addr)
	}()

	signals := make(chan os.Signal, 1)
	done := make(chan bool)
	signal.Notify(signals, syscall.SIGTERM)

	go func() {
		<-signals
		done <- true
	}()

	runLeds(strip, animations, ch, done)
}

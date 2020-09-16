package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gvalkov/golang-evdev"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

const (
	defaultNumLeds    = 74
	defaultStartIndex = 10

	updatePeriod = 40 * time.Millisecond
	enableIR     = false
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
	strip := NewStrip(numLeds, startIndex, 5.0*74.0/150.0, conn) // TODO: length is all wrong here; not general

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

	ticker := time.NewTicker(updatePeriod)

loop:
	for {
		select {
		case new_cb := <-ch:
			startTime = time.Now()
			cb = new_cb
		case <-ticker.C:
			now := time.Now()
			t := now.Sub(startTime).Seconds()
			dt := now.Sub(t0).Seconds()

			if dt > 2*updatePeriod.Seconds() {
				dt = 2 * updatePeriod.Seconds()
			}

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
		"white":   white,
		"bounce":  Bounce().Tick,
		"cycle1": cycle(
			Bounce().Tick,
			rainbow(strip),
		),
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

	if enableIR {
		device, err := evdev.Open("/dev/input/event0")
		if err != nil {
			panic(err)
		}

		go func() {
			for {
				event, err := device.ReadOne()
				if err != nil {
					panic(err)
				}
				fmt.Println(event)
				if event.Code == 4 && event.Type == 4 {
					log.Println("code", event.Code)
					switch event.Value {
					case 48912: // 1
						ch <- animations["bounce"]
					case 48913: // 2
						ch <- animations["rainbow"]
					case 48896: // vol-
						strip.ScaleDown()
					case 48898: // vol+
						strip.ScaleUp()
					}
				}
			}
		}()
	}

	signals := make(chan os.Signal, 1)
	done := make(chan bool)
	signal.Notify(signals, syscall.SIGTERM)

	go func() {
		<-signals
		done <- true
	}()

	runLeds(strip, animations, ch, done)
}

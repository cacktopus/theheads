package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/larspensjo/Go-simplex-noise/simplexnoise"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"log"
	"math"
	"os"
	"os/signal"
	"periph.io/x/periph/conn/physic"
	"periph.io/x/periph/conn/spi"
	"periph.io/x/periph/conn/spi/spireg"
	"periph.io/x/periph/host"
	"strconv"
	"syscall"
	"time"
)

var ibits = [4]uint{3, 2, 1, 0}

const (
	maxBrightness = 0.33

	meter = 1.0
	inch  = 0.0254 * meter

	ledRingRadius = (15.0/2 - 1) * inch
)

var (
	numLeds  = 74
	startLed = 10
)

var (
	leds      []led
	positions []Vec2
	spiConn   spi.Conn
)

func init() {
	strNumLeds, ok := os.LookupEnv("NUM_LEDS")
	if ok {
		var err error
		numLeds, err = strconv.Atoi(strNumLeds)
		if err != nil {
			panic(err)
		}
	}

	strStartLed, ok := os.LookupEnv("START_LED")
	if ok {
		var err error
		startLed, err = strconv.Atoi(strStartLed)
		if err != nil {
			panic(err)
		}
	}

	leds = make([]led, numLeds)
	positions = make([]Vec2, numLeds)

	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		log.Fatal(err)
	}

	// Use spireg SPI port registry to find the first available SPI bus.
	p, err := spireg.Open("")
	if err != nil {
		log.Fatal(err)
	}
	// defer p.Close() # TODO

	// Convert the spi.Port into a spi.Conn so it can be used for communication.
	spiConn, err = p.Connect(3809524*physic.Hertz, spi.Mode3, 8)
	if err != nil {
		log.Fatal(err)
	}

	// Calculate real-world approximate position of LEDS
	for i, n := startLed, 0; i < numLeds; i, n = i+1, n+1 {
		N := (numLeds - startLed) - 1
		theta := (2 * math.Pi) * (float64(n) / float64(N+1))
		u := Vec2{math.Cos(theta), math.Sin(theta)}
		u = u.Scale(ledRingRadius * 3.333)
		positions[i] = u
	}

	// reset
	send(spiConn, leds)
}

func adaptForSpi(data []byte) []byte {
	var result []byte = nil

	for _, b := range data {
		for _, ibit := range ibits {
			val := ((b>>(2*ibit+1))&1)*0x60 + ((b>>(2*ibit+0))&1)*0x06 + 0x88
			result = append(result, val)
		}
	}
	return result
}

func send(conn spi.Conn, leds []led) {
	write := make([]byte, numLeds*3)

	for i := 0; i < numLeds; i++ {
		write[i*3+0] = byte(255.0 * clamp(0, leds[i].g, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, leds[i].r, maxBrightness))
		write[i*3+2] = byte(255.0 * clamp(0, leds[i].b, maxBrightness))
	}

	adapted := adaptForSpi(write)
	read := make([]byte, len(adapted))
	if err := conn.Tx(adapted, read); err != nil {
		log.Fatal(err)
	}
}

func clamp(min, x, max float64) float64 {
	if x < min {
		return min
	}
	if x > max {
		return max
	}
	return x
}

type led struct {
	r, g, b float64
}

type callback func(time.Duration)

func lowred(t time.Duration) {
	for i := startLed; i < numLeds; i++ {
		leds[i].r = 0.10
		leds[i].g = 0
		leds[i].b = 0
	}
}

func decay(t time.Duration) {
	decayConstant := 0.99

	if t < time.Second*30 {
		for i := startLed; i < numLeds; i++ {
			leds[i].r *= decayConstant
			leds[i].g *= decayConstant
			leds[i].b *= decayConstant
		}
	} else {
		for i := startLed; i < numLeds; i++ {
			leds[i].r = 0.10
			leds[i].g = 0
			leds[i].b = 0
		}
	}
}

func rainbow(tick time.Duration) {
	timeScale := 3E-10

	for i := startLed; i < numLeds; i++ {
		pos := positions[i]
		leds[i].r = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			float64(pos.x+000),
			float64(pos.y+000),
			float64(tick)*timeScale,
		))

		leds[i].g = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			float64(pos.x+100),
			float64(pos.y+100),
			float64(tick)*timeScale,
		))

		leds[i].b = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			float64(pos.x+200),
			float64(pos.y+200),
			float64(tick)*timeScale,
		))
	}
}

func runLeds(ch <-chan callback, done <-chan bool) {
	t0 := time.Now()
	var cb callback = rainbow

loop:
	for {
		select {
		case new_cb := <-ch:
			fmt.Println(new_cb)
			t0 = time.Now()
			cb = new_cb
		case <-time.After(time.Millisecond * 30):
			t := time.Now().Sub(t0)
			cb(t)
			send(spiConn, leds)
		case <-done:
			break loop
		}
	}

	// cleanup: set to low red
	for i := startLed; i < numLeds; i++ {
		leds[i].r = 0.10
		leds[i].g = 0
		leds[i].b = 0
	}
	send(spiConn, leds)
}

func main() {
	addr := ":8082"
	ch := make(chan callback)

	r := gin.New()
	r.Use(
		gin.LoggerWithWriter(gin.DefaultWriter, "/metrics", "/health"),
		gin.Recovery(),
	)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"result": "ok",
		})
	})

	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	r.GET("/rainbow", func(c *gin.Context) {
		ch <- rainbow
		c.JSON(200, gin.H{"result": "ok"})
	})

	r.GET("/decay", func(c *gin.Context) {
		ch <- decay
		c.JSON(200, gin.H{"result": "ok"})
	})

	r.GET("/lowred", func(c *gin.Context) {
		ch <- lowred
		c.JSON(200, gin.H{"result": "ok"})
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

	runLeds(ch, done)
}

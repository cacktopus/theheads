package main

import (
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

	timeDelta = time.Millisecond * 3
)

const (
	defaultNumLeds = 74
)

var (
	positions []Vec2
	startLed  = 10
)

type Transactor interface {
	Tx(w, r []byte) error
}

type NoStrip struct {
}

func (*NoStrip) Tx(w, r []byte) error {
	return nil
}

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

	strStartLed, ok := os.LookupEnv("START_LED")
	if ok {
		var err error
		startLed, err = strconv.Atoi(strStartLed)
		if err != nil {
			panic(err)
		}
	}

	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		log.Fatal(err)
	}

	_, ok = os.LookupEnv("NO_LEDS")
	var conn Transactor
	if ok {
		conn = &NoStrip{}
	} else {
		// Use spireg SPI port registry to find the first available SPI bus.
		p, err := spireg.Open("")
		if err != nil {
			log.Fatal(err)
		}
		// defer p.Close() # TODO

		// Convert the spi.Port into a spi.Conn so it can be used for communication.
		spiConn, err := p.Connect(3809524*physic.Hertz, spi.Mode3, 8)
		if err != nil {
			log.Fatal(err)
		}

		conn = spiConn
	}

	strip := NewStrip(numLeds, 5.0*74.0/150.0, conn)

	// Calculate real-world approximate position of LEDS
	positions = make([]Vec2, numLeds)
	for i, n := startLed, 0; i < numLeds; i, n = i+1, n+1 {
		N := (numLeds - startLed) - 1
		theta := (2 * math.Pi) * (float64(n) / float64(N+1))
		u := Vec2{math.Cos(theta), math.Sin(theta)}
		u = u.Scale(ledRingRadius * 3.333)
		positions[i] = u
	}

	// reset
	strip.send()

	return strip
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

type callback func(strip *Strip, t, dt float64)

func lowred(strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = 0.10
		led.g = 0
		led.b = 0
	})
}

func off(strip *Strip, t, dt float64) {
	strip.Each(func(_ int, led *Led) {
		led.r = 0
		led.g = 0
		led.b = 0
	})
}

func decay(strip *Strip, t, dt float64) {
	decayConstant := 0.99

	if t < 30 {
		strip.Each(func(_ int, led *Led) {
			led.r *= decayConstant
			led.g *= decayConstant
			led.b *= decayConstant
		})
	} else {
		strip.Each(func(_ int, led *Led) {
			led.r = 0.10
			led.g = 0
			led.b = 0
		})
	}
}

func rainbow(strip *Strip, t, dt float64) {
	timeScale := 0.3

	strip.Each(func(i int, led *Led) {
		pos := positions[i]
		led.r = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+000,
			pos.y+000,
			t*timeScale,
		))

		led.g = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+100,
			pos.y+100,
			t*timeScale,
		))

		led.b = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
			pos.x+200,
			pos.y+200,
			t*timeScale,
		))
	})
}

func runLeds(strip *Strip, ch <-chan callback, done <-chan bool) {
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

var animations = map[string]callback{
	"rainbow": rainbow,
	"decay":   decay,
	"lowred":  lowred,
	"bounce":  Bounce().Tick,
	"off":     off,
}

func main() {
	strip := setup()

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

	r.GET("/run/:name", func(c *gin.Context) {
		name := c.Param("name")
		fn, ok := animations[name]
		if ok {
			ch <- fn
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

	runLeds(strip, ch, done)
}

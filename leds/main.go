package main

import (
	"github.com/larspensjo/Go-simplex-noise/simplexnoise"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"log"
	"math"
	"net/http"
	"periph.io/x/periph/conn/physic"
	"periph.io/x/periph/conn/spi"
	"periph.io/x/periph/conn/spi/spireg"
	"periph.io/x/periph/host"
	"time"
)

var ibits = [4]uint{3, 2, 1, 0}

const (
	numLeds       = 74
	maxBrightness = 0.33
	startLed      = 10

	meter = 1.0
	inch  = 0.0254 * meter

	ledRingRadius = (15.0/2 - 1) * inch
)

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
		// TODO: confirm rgb order
		write[i*3+0] = byte(255.0 * clamp(0, leds[i].r, maxBrightness))
		write[i*3+1] = byte(255.0 * clamp(0, leds[i].g, maxBrightness))
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

func runLeds() {
	// Make sure periph is initialized.
	if _, err := host.Init(); err != nil {
		log.Fatal(err)
	}

	// Use spireg SPI port registry to find the first available SPI bus.
	p, err := spireg.Open("")
	if err != nil {
		log.Fatal(err)
	}
	defer p.Close()

	// Convert the spi.Port into a spi.Conn so it can be used for communication.
	c, err := p.Connect(3809524*physic.Hertz, spi.Mode3, 8)
	if err != nil {
		log.Fatal(err)
	}

	leds := make([]led, numLeds)
	positions := make([]Vec2, numLeds)

	// Calculate real-world approximate position of LEDS
	for i, n := startLed, 0; i < numLeds; i, n = i+1, n+1 {
		N := (numLeds - startLed) - 1
		theta := (2 * math.Pi) * (float64(n) / float64(N+1))
		u := Vec2{math.Cos(theta), math.Sin(theta)}
		u = u.Scale(ledRingRadius * 3.333)
		positions[i] = u
	}

	// reset state. TODO: gradually turn this to zero.
	send(c, leds)

	for t := 0; ; t++ {
		for i := startLed; i < numLeds; i++ {
			pos := positions[i]
			leds[i].r = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
				float64(pos.x+000),
				float64(pos.y+000),
				float64(t)*0.003,
			))

			leds[i].g = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
				float64(pos.x+100),
				float64(pos.y+100),
				float64(t)*0.003,
			))

			leds[i].b = maxBrightness * (0.5 + 0.5*simplexnoise.Noise3(
				float64(pos.x+200),
				float64(pos.y+200),
				float64(t)*0.003,
			))
		}

		send(c, leds)

		time.Sleep(time.Millisecond * 30)
	}
}

func main() {
	go func() {
		addr := ":8082"

		http.Handle("/metrics", promhttp.Handler())
		http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("OK\n"))
		})
		http.ListenAndServe(addr, nil)
	}()

	runLeds()
}

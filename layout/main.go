package main

import (
	"fmt"
	"io/ioutil"
	"math"
	"os"
)

func Radians(degrees float64) float64 {
	return degrees * math.Pi / 180
}

func Degrees(radians float64) float64 {
	return radians * 180 / math.Pi
}

func cmToFeet(x float64) float64 {
	return x / 12 / 2.54
}

var headPos = []int{4, 3, 1, 7, 8, 2, 5, 6, 9}

var tmpl = `
cameras: [ camera-%02d ]
heads: [ head-%02d ]
name: stand-%02d
pos: { x: %2f, y: %2f }
rot: -90
`

func main() {
	const (
		a            = 1323.34 / 100
		b            = 121.92 / 100
		thetaDegrees = 5.28
	)

	theta := Radians(thetaDegrees)

	for i := -4; i <= 4; i++ {
		phi := float64(i) * theta
		x := a * math.Sin(phi)
		y := -a + a*math.Cos(phi)

		pos := headPos[i+4]

		//fmt.Println(i, x, y, cmToFeet(x), cmToFeet(y))
		stand := fmt.Sprintf(tmpl, pos, pos, pos, x, y)

		outdir := os.ExpandEnv("$HOME/shared/theheads/scenes/hb2021/stands")

		err := ioutil.WriteFile(outdir+fmt.Sprintf("/stand-%02d.yaml", pos), []byte(stand), 0o600)
		noError(err)
	}
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

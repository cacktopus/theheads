package main

import (
	"errors"
	"fmt"
	"gocv.io/x/gocv"
	"math"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func main() {
	for _, filename := range os.Args[1:] {
		fixed := strings.Replace(filename, ":", "_", -1)
		if fixed != filename {
			os.Rename(filename, fixed)
			filename = fixed
		}

		absPath, err := filepath.Abs(filename)
		if err != nil {
			panic(err)
		}

		parts := strings.Split(absPath, "/")
		fmt.Println(parts)

		outName := fmt.Sprintf("%s_%s", parts[len(parts)-2], parts[len(parts)-1])

		func() {
			dir := os.TempDir()

			defer os.RemoveAll(dir)

			outfile := filepath.Join(dir, filename+".mp4")
			fmt.Println(outfile)

			args := []string{
				"MP4Box", "-add", filename, outfile,
			}

			fmt.Println(strings.Join(args, " "))

			cmd := exec.Command(args[0], args[1:]...)
			output, err := cmd.CombinedOutput()
			if err != nil {
				panic(err)
			}
			fmt.Println(string(output))

			class, err := classify(outfile)
			if err != nil {
				fmt.Println(err)
				return
			}

			fmt.Println(" =>" + class)
			link := filepath.Join(os.ExpandEnv("$HOME"), class, outName)
			fmt.Println(absPath, link)

			err = os.Symlink(absPath, link)
			if err != nil {
				panic(err)
			}
		}()

	}

}

func Sub(s0, s1 gocv.Scalar) gocv.Scalar {
	return gocv.Scalar{
		Val1: s0.Val1 - s1.Val1,
		Val2: s0.Val2 - s1.Val2,
		Val3: s0.Val3 - s1.Val3,
		Val4: s0.Val4 - s1.Val4,
	}
}

func Abs(s0 gocv.Scalar) float64 {
	return math.Sqrt(s0.Val1*s0.Val1 + s0.Val2*s0.Val2 + s0.Val3*s0.Val3 + s0.Val4*s0.Val4)
}

func Distance(a, b gocv.Scalar) float64 {
	return Abs(Sub(a, b))
}

var day = gocv.NewScalar(142, 83, 143, 0)
var night = gocv.NewScalar(110, 48, 82, 0)

func classify(outfile string) (string, error) {
	cap, err := gocv.VideoCaptureFile(outfile)
	if err != nil {
		panic(err)
	}

	var means []gocv.Scalar
	var width, height int

	do := func() bool {
		m := gocv.NewMat()
		defer m.Close()
		ok := cap.Read(&m)
		if !ok {
			return ok
		}

		sz := m.Size()
		width, height = sz[1], sz[0]

		if width != 1280 || height != 720 {
			return false
		}

		s := m.Mean()
		means = append(means, s)

		return true
	}

	for do() {
	}

	if width != 1280 || height != 720 {
		return "", errors.New("invalid size")
	}

	sum := gocv.NewScalar(0, 0, 0, 0)
	for _, mean := range means {
		sum = gocv.NewScalar(
			sum.Val1+mean.Val1,
			sum.Val2+mean.Val2,
			sum.Val3+mean.Val3,
			sum.Val4+mean.Val4,
		)
	}

	mean := gocv.NewScalar(
		sum.Val1/float64(len(means)),
		sum.Val2/float64(len(means)),
		sum.Val3/float64(len(means)),
		sum.Val4/float64(len(means)),
	)

	dayD := Distance(day, mean)
	nightD := Distance(night, mean)

	fmt.Println(mean, dayD, nightD)

	if dayD < nightD {
		return "day", nil
	} else {
		return "night", nil
	}
}

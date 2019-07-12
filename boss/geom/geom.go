package geom

import (
	"gonum.org/v1/gonum/mat"
	"math"
)

func Translate(x, y float64) *mat.Dense {
	return mat.NewDense(3, 3, []float64{
		1, 0, x,
		0, 1, y,
		0, 0, 1,
	})
}

func Rotz(thetaDegrees float64) *mat.Dense {
	t := thetaDegrees * math.Pi / 180
	return mat.NewDense(3, 3, []float64{
		math.Cos(t), -math.Sin(t), 0,
		math.Sin(t), math.Cos(t), 0,
		0, 0, 1,
	})
}

func ToM(x, y, rot float64) *mat.Dense {
	result := mat.NewDense(3, 3, nil)
	result.Product(
		Translate(x, y),
		Rotz(rot),
	)
	return result
}

func MatMul(a, b *mat.Dense) *mat.Dense {
	result := mat.NewDense(3, 3, nil)
	result.Product(a, b)
	return result
}

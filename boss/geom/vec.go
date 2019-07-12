package geom

import (
	"gonum.org/v1/gonum/mat"
	"math"
)

func Clamp(a, x, b float64) float64 {
	if x < a {
		return a
	}
	if x > b {
		return b
	}
	return x
}

type Vec struct {
	data *mat.VecDense
}

func Zero() Vec {
	return Vec{mat.NewVecDense(3, nil)}
}

func NewVec(x float64, y float64) Vec {
	return Vec{mat.NewVecDense(3, []float64{x, y, 1.0})}
}

func (v Vec) Add(other Vec) Vec {
	result := Zero()
	result.data.AddVec(v.data, other.data)
	return result
}

func (v Vec) Sub(other Vec) Vec {
	result := Zero()
	result.data.SubVec(v.data, other.data)
	return result
}

func (v Vec) Abs() float64 {
	return math.Sqrt(mat.Dot(v.data, v.data))
}

func (v Vec) X() float64 {
	return v.data.AtVec(0)
}

func (v Vec) Y() float64 {
	return v.data.AtVec(1)
}

func (v Vec) Clamp(minX, minY, maxX, maxY float64) Vec {
	return NewVec(
		Clamp(minX, v.X(), maxX),
		Clamp(minY, v.Y(), maxY),
	)
}

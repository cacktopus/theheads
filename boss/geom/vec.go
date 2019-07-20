package geom

import (
	"fmt"
	"gonum.org/v1/gonum/mat"
	"math"
)

type Vec struct {
	data *mat.VecDense
}

func ZeroVec() Vec {
	return NewVec(0, 0) // z is implicitly 1.0
}

func NewVec(x float64, y float64) Vec {
	return Vec{mat.NewVecDense(3, []float64{x, y, 1.0})}
}

func (v Vec) Add(other Vec) Vec {
	result := ZeroVec()
	result.data.AddVec(v.data, other.data)
	return result
}

func (v Vec) Sub(other Vec) Vec {
	result := ZeroVec()
	result.data.SubVec(v.data, other.data)
	return result
}

func (v Vec) Scale(a float64) Vec {
	result := ZeroVec()
	result.data.ScaleVec(a, v.data)
	return result
}

func (v Vec) Abs() float64 {
	return math.Sqrt(mat.Dot(v.data, v.data))
}

func (v Vec) AbsSq() float64 {
	return mat.Dot(v.data, v.data)
}

func (v Vec) X() float64 {
	return v.data.AtVec(0)
}

func (v Vec) Y() float64 {
	return v.data.AtVec(1)
}

func (v Vec) AsStr() string {
	return fmt.Sprintf("(%f, %f)", v.X(), v.Y())
}

func (v Vec) Clamp(minX, minY, maxX, maxY float64) Vec {
	return NewVec(
		Clamp(minX, v.X(), maxX),
		Clamp(minY, v.Y(), maxY),
	)
}

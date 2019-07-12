package geom

import "gonum.org/v1/gonum/mat"

type Mat struct {
	data *mat.Dense
}

func NewMat(
	a, b, c,
	d, e, f,
	g, h, i float64,
) Mat {
	return Mat{mat.NewDense(3, 3, []float64{
		a, b, c,
		d, e, f,
		g, h, i,
	})}
}

func (m Mat) Mul(other Mat) Mat {
	result := mat.NewDense(3, 3, nil)
	result.Product(m.data, other.data)
	return Mat{result}
}

func (m Mat) MulVec(v Vec) Vec {
	result := ZeroVec()
	result.data.MulVec(m.data, v.data)
	return result
}

func (m Mat) Translation() Vec {
	col := m.data.ColView(2)
	return NewVec(col.AtVec(0), col.AtVec(1))
}

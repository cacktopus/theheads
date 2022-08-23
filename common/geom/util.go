package geom

func Clamp(a, x, b float64) float64 {
	if x < a {
		return a
	}
	if x > b {
		return b
	}
	return x
}


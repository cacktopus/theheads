package main

type Vec2 struct {
	x, y float64
}

func (v0 Vec2) Add(v1 Vec2) Vec2 {
	return Vec2{v0.x + v1.x, v0.y + v1.y}
}

func (v0 Vec2) Scale(c float64) Vec2 {
	return Vec2{v0.x * c, v0.y * c}
}

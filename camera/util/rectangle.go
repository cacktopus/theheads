package util

import (
	"gocv.io/x/gocv"
	"image"
	"image/color"
	"math"
)

type Rectangle struct {
	Left, Right, Top, Bottom float64
}

func (r *Rectangle) Draw(frame *gocv.Mat, color color.RGBA) {
	left := int(r.Left * float64(frame.Cols()))
	top := int(r.Top * float64(frame.Rows()))
	right := int(r.Right * float64(frame.Cols()))
	bottom := int(r.Bottom * float64(frame.Rows()))
	rect := image.Rect(left, top, right, bottom)
	gocv.Rectangle(frame, rect, color, 2)
}

func (r *Rectangle) FrameCoords(frame *gocv.Mat) image.Rectangle {
	left := int(r.Left * float64(frame.Cols()))
	top := int(r.Top * float64(frame.Rows()))
	right := int(r.Right * float64(frame.Cols()))
	bottom := int(r.Bottom * float64(frame.Rows()))

	return image.Rect(left, top, right, bottom)
}

// Theta computes the horizontal angle (in degrees) of the center of the rectangle
// given a field of view (also in degrees)
func (r *Rectangle) Theta(fov float64) float64 {
	center := (r.Left+r.Right)/2 - 0.5 // center ranges from -0.5 to 0.5
	return -fov * center
}

func (r *Rectangle) Area() float64 {
	return math.Abs(r.Left-r.Right) * math.Abs(r.Top-r.Bottom)
}

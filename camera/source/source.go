package source

import (
	"github.com/pkg/errors"
	"gocv.io/x/gocv"
)

var (
	ErrFrameReadFailed = errors.New("failed to read frame")
)

type FrameGrabber interface {
	Grab(dst *gocv.Mat) error
}

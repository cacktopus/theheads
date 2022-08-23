package source

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pkg/errors"
	"gocv.io/x/gocv"
)

type Webcam struct {
	env *cfg.Cfg
	dev *gocv.VideoCapture
}

func NewWebcam(env *cfg.Cfg) (*Webcam, error) {
	w := &Webcam{env: env}

	var err error
	w.dev, err = gocv.OpenVideoCapture(0)
	if err != nil {
		return nil, errors.Wrap(err, "open video capture")
	}

	w.dev.Set(gocv.VideoCaptureFrameWidth, float64(w.env.Width))
	w.dev.Set(gocv.VideoCaptureFrameHeight, float64(w.env.Height))
	w.dev.Set(gocv.VideoCaptureFPS, float64(w.env.Framerate))

	return w, nil
}

func (w *Webcam) Grab(dst *gocv.Mat) error {
	ok := w.dev.Read(dst)
	if !ok {
		return ErrFrameReadFailed
	}

	gocv.CvtColor(*dst, dst, gocv.ColorBGRToGray)

	return nil
}

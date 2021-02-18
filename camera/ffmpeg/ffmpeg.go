package ffmpeg

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/motion_detector"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/broker"
	"go.uber.org/zap"
	"gocv.io/x/gocv"
	"image"
	"image/color"
	"time"
)

type Buffer struct {
	Data []byte
}

func (f *Buffer) Name() string {
	return "buffer"
}

type ffmpeg struct {
	buf    gocv.Mat
	env    *cfg.Cfg // TODO: separate cfg
	feeder chan gocv.Mat
	broker *broker.Broker
}

func NewFfmpeg(env *cfg.Cfg, logger *zap.Logger, broker *broker.Broker) *ffmpeg {
	return &ffmpeg{
		buf:    gocv.NewMat(),
		env:    env,
		broker: broker,
		feeder: runFfmpeg(logger, broker, env.Bitrate, env.Framerate),
	}
}

func (ff *ffmpeg) Ffmpeg(
	src *gocv.Mat,
	maxRecord *motion_detector.MotionRecord,
) {
	if ff.broker.SubCount() == 0 {
		return
	}

	util.T("copy", func() {
		src.CopyTo(&ff.buf)
	})

	if ff.env.CenterLine {
		util.T("center-line", func() {
			sz := ff.buf.Size()
			x := sz[1]
			y := sz[0]
			gocv.Line(
				&ff.buf,
				image.Point{X: x/2 - 1, Y: 0},
				image.Point{X: x/2 - 1, Y: y},
				color.RGBA{B: 128, G: 128, R: 128, A: 128},
				2,
			)
		})
	}

	if ff.env.DrawMotion {
		util.T("draw-motion", func() {
			// TODO: this isn't going to work when we have different frame sizes for detection and drawing
			if maxRecord != nil && maxRecord.Area > 0 {
				gocv.Rectangle(&ff.buf, maxRecord.Bounds, color.RGBA{R: 128, G: 128, B: 128, A: 255}, 2)
			}
		})
	}

	util.T("put-text", func() {
		currentTime := time.Now().Format("2006-01-02 15:04:05")
		gocv.PutText(
			&ff.buf,
			currentTime,
			image.Point{X: 13, Y: 23},
			gocv.FontHersheySimplex,
			0.5,
			color.RGBA{R: 32, G: 32, B: 32, A: 255},
			2,
		)

		gocv.PutText(
			&ff.buf,
			currentTime,
			image.Point{X: 10, Y: 20},
			gocv.FontHersheySimplex,
			0.5,
			color.RGBA{R: 160, G: 160, B: 160, A: 255},
			2,
		)
	})

	select {
	case ff.feeder <- ff.buf:
	default:
		// TODO: dropped frame counter
	}
}

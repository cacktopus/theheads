package motion_detector

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/util"
	"gocv.io/x/gocv"
	"image"
)

type MotionDetector struct {
	// TODO: have a separate Cfg for MotionDetector so we don't have to import this
	env *cfg.Cfg

	avg        gocv.Mat
	frameDelta gocv.Mat
	thresh     gocv.Mat
	ffmpegBuf  gocv.Mat
	blurred    gocv.Mat
	orig       gocv.Mat
	resized    gocv.Mat

	frames map[string]*gocv.Mat

	frameCount int
	cpuTimer   *util.CPUTimer
}

func NewMotionDetector(env *cfg.Cfg, cpuTimer *util.CPUTimer) *MotionDetector {
	md := &MotionDetector{
		env:        env,
		cpuTimer:   cpuTimer,
		avg:        gocv.NewMat(),
		frameDelta: gocv.NewMat(),
		thresh:     gocv.NewMat(),
		ffmpegBuf:  gocv.NewMat(),
		blurred:    gocv.NewMat(),
		orig:       gocv.NewMat(),
		resized:    gocv.NewMat(),
	}

	md.frames = map[string]*gocv.Mat{
		"avg":         &md.avg,
		"frame-delta": &md.frameDelta,
		"thresh":      &md.thresh,
		"blurred":     &md.blurred,
		"orig":        &md.orig,
		"resized":     &md.resized,
	}

	return md
}

type MotionRecord struct {
	Bounds      util.Rectangle
	ContourArea float64
}

func (md *MotionDetector) Detect(
	env *cfg.Cfg,
	m gocv.Mat,
) []*MotionRecord {
	md.frameCount++

	md.cpuTimer.T("copy", func() {
		m.CopyTo(&md.orig)
	})

	md.cpuTimer.T("resize", func() {
		sz := md.orig.Size()
		width, height := sz[1], sz[0]

		scale := float64(env.MotionDetectWidth) / float64(width)

		newWidth := int(scale * float64(width))
		newHeight := int(scale * float64(height))

		gocv.Resize(md.orig, &md.resized, image.Pt(newWidth, newHeight), 0, 0, gocv.InterpolationNearestNeighbor)
	})

	md.cpuTimer.T("blur", func() {
		gocv.GaussianBlur(md.resized, &md.blurred, image.Point{X: 7, Y: 7}, 0, 0, gocv.BorderDefault)
	})

	if md.avg.Empty() {
		md.cpuTimer.T("copy", func() {
			md.blurred.CopyTo(&md.avg)
		})
	}

	md.cpuTimer.T("add-weighted", func() {
		gocv.AddWeighted(md.blurred, 0.35, md.avg, 0.65, 0, &md.avg)
	})

	md.cpuTimer.T("abs-diff", func() {
		gocv.AbsDiff(md.blurred, md.avg, &md.frameDelta)
	})

	md.cpuTimer.T("threshold", func() {
		gocv.Threshold(md.frameDelta, &md.thresh, float32(env.MotionThreshold), 255, gocv.ThresholdBinary)
	})

	var contours gocv.PointsVector
	md.cpuTimer.T("contours", func() {
		contours = gocv.FindContours(md.thresh, gocv.RetrievalExternal, gocv.ChainApproxSimple)
	})
	defer contours.Close()

	if md.frameCount < env.WarmupFrames {
		return nil
	}

	var records []*MotionRecord
	for i := 0; i < contours.Size(); i++ {
		sz := md.resized.Size()
		width, height := sz[1], sz[0]

		bounds := gocv.BoundingRect(contours.At(i))

		records = append(records, &MotionRecord{
			Bounds: util.Rectangle{
				Left:   float64(bounds.Min.X) / float64(width),
				Right:  float64(bounds.Max.X) / float64(width),
				Top:    float64(bounds.Min.Y) / float64(height),
				Bottom: float64(bounds.Max.Y) / float64(height),
			},
			ContourArea: gocv.ContourArea(contours.At(i)),
		})
	}

	return records
}

func (md *MotionDetector) GetFrame(name string) (*gocv.Mat, bool) {
	m, ok := md.frames[name]
	return m, ok
}

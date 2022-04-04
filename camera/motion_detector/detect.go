package motion_detector

import (
	"errors"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/util"
	"gocv.io/x/gocv"
	"image"
	"strconv"
	"strings"
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
	roi        gocv.Mat

	roiP0 image.Point
	roiP1 image.Point

	frames map[string]*gocv.Mat
}

func NewMotionDetector(env *cfg.Cfg) *MotionDetector {
	md := &MotionDetector{
		env:        env,
		avg:        gocv.NewMat(),
		frameDelta: gocv.NewMat(),
		thresh:     gocv.NewMat(),
		ffmpegBuf:  gocv.NewMat(),
		blurred:    gocv.NewMat(),
		orig:       gocv.NewMat(),
		resized:    gocv.NewMat(),
		roi:        gocv.NewMat(),
	}

	md.frames = map[string]*gocv.Mat{
		"avg":         &md.avg,
		"frame-delta": &md.frameDelta,
		"thresh":      &md.thresh,
		"blurred":     &md.blurred,
		"orig":        &md.orig,
		"resized":     &md.resized,
		"roi":         &md.roi,
	}

	if env.ROI != "" {
		var coords [4]int
		parts := strings.Split(env.ROI, ",")
		if len(parts) != 4 {
			panic(errors.New("invalid ROI"))
		}
		for i, part := range parts {
			var err error
			coords[i], err = strconv.Atoi(part)
			if err != nil {
				panic(errors.New("invalid ROI"))
			}
		}
		md.roiP0 = image.Point{X: coords[0], Y: coords[1]}
		md.roiP1 = image.Point{X: coords[2], Y: coords[3]}
	}

	return md
}

type MotionRecord struct {
	Bounds     image.Rectangle
	X          int
	Area       float64
	FrameWidth int // width of original full frame used to perform motion detection
}

func (md *MotionDetector) Detect(env *cfg.Cfg, m gocv.Mat) []*MotionRecord {
	util.T("copy", func() {
		m.CopyTo(&md.orig)
	})

	util.T("resize", func() {
		sz := md.orig.Size()
		width, height := sz[1], sz[0]

		scale := float64(env.MotionDetectWidth) / float64(width)

		newWidth := int(scale * float64(width))
		newHeight := int(scale * float64(height))

		gocv.Resize(md.orig, &md.resized, image.Pt(newWidth, newHeight), 0, 0, gocv.InterpolationNearestNeighbor)
	})

	util.T("roi", func() {
		sz := md.resized.Size()
		width, height := sz[1], sz[0]

		roi := md.resized.Region(image.Rectangle{
			Min: md.roiP0,
			Max: image.Point{X: width - md.roiP1.X, Y: height - md.roiP1.Y},
		})
		defer roi.Close()
		roi.CopyTo(&md.roi)
	})

	util.T("blur", func() {
		gocv.GaussianBlur(md.roi, &md.blurred, image.Point{X: 7, Y: 7}, 0, 0, gocv.BorderDefault)
	})

	if md.avg.Empty() {
		util.T("copy", func() {
			md.blurred.CopyTo(&md.avg)
		})
	}

	util.T("add-weighted", func() {
		gocv.AddWeighted(md.blurred, 0.35, md.avg, 0.65, 0, &md.avg)
	})

	util.T("abs-diff", func() {
		gocv.AbsDiff(md.blurred, md.avg, &md.frameDelta)
	})

	util.T("threshold", func() {
		gocv.Threshold(md.frameDelta, &md.thresh, float32(env.MotionThreshold), 255, gocv.ThresholdBinary)
	})

	var contours [][]image.Point
	util.T("contours", func() {
		contours = gocv.FindContours(md.thresh, gocv.RetrievalExternal, gocv.ChainApproxSimple)
	})

	var records []*MotionRecord
	for _, c := range contours {
		bounds := gocv.BoundingRect(c)

		// add the "clipped" sections that were "removed" when doing ROI so
		// that we are working in full frame coordinates.
		bounds.Min.X += md.roiP0.X
		bounds.Min.Y += md.roiP0.Y
		bounds.Max.X += md.roiP0.X
		bounds.Max.Y += md.roiP0.Y

		x := bounds.Min.X + bounds.Dx()/2 // middle of the bounding box

		sz := md.resized.Size()
		frameWidth := sz[1]

		records = append(records, &MotionRecord{
			Bounds:     bounds,
			X:          x,
			Area:       gocv.ContourArea(c),
			FrameWidth: frameWidth,
		})
	}

	return records
}

func (md *MotionDetector) GetFrame(name string) (*gocv.Mat, bool) {
	m, ok := md.frames[name]
	return m, ok
}

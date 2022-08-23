package face_detector

import (
	_ "embed"
	"fmt"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/cacktopus/theheads/camera/util"
	"github.com/cacktopus/theheads/common/geom"
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/cacktopus/theheads/common/timed_reset"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"gocv.io/x/gocv"
	"image"
	"image/color"
	"math"
	"sync"
	"time"
)

//go:embed deploy.prototxt
var prototxt []byte

//go:embed res10_300x300_ssd_iter_140000_fp16.caffemodel
var caffemodel []byte

type Face struct {
	Bounds     util.Rectangle
	Confidence float64
}

type Detector struct {
	sz300x300 gocv.Mat
	net       gocv.Net

	cooldown       *timed_reset.Bool
	cooldownPeriod time.Duration

	enabled *timed_reset.Bool

	faces []*Face
	input chan gocv.Mat

	lock sync.Mutex

	searchStarted   time.Time
	callback        func([]*Face, []byte)
	env             *cfg.Cfg
	cDetectingFaces prometheus.Counter
	cFaceFound      prometheus.Counter

	region image.Rectangle
}

func NewDetector(
	env *cfg.Cfg,
	registry prometheus.Registerer,
	callback func([]*Face, []byte),
) *Detector {
	net, err := gocv.ReadNetFromCaffeBytes(
		prototxt,
		caffemodel,
	)
	if err != nil {
		panic(err)
	}

	d := &Detector{
		env:            env,
		sz300x300:      gocv.NewMat(),
		net:            net,
		cooldown:       timed_reset.NewBool(),
		cooldownPeriod: 3 * time.Second,
		callback:       callback,

		enabled: timed_reset.NewBool(),

		input: make(chan gocv.Mat),

		cDetectingFaces: metrics.SimpleCounter(registry, "camera", "dnn_detecting_faces"),
		cFaceFound:      metrics.SimpleCounter(registry, "camera", "dnn_face_found"),
	}

	promauto.With(registry).NewGaugeFunc(prometheus.GaugeOpts{
		Namespace: "heads",
		Subsystem: "camera",
		Name:      "dnn_enabled",
	}, func() float64 {
		if d.enabled.Val() {
			return 1.0
		}
		return 0.0
	})

	go d.backgroundDetector()

	return d
}

func (d *Detector) backgroundDetector() {
	for mat := range d.input {
		d.detectFace(mat)
		mat.Close()
	}
}

func (d *Detector) detectFace(src gocv.Mat) {
	d.cDetectingFaces.Inc()
	t := time.Now()

	var faces []*Face

	d.setupRegion(src)
	func() {
		sz300x300 := src.Region(d.region)
		defer sz300x300.Close()
		sz300x300.CopyTo(&d.sz300x300)
	}()

	scaleX := 300.0 / float64(src.Cols())
	scaleY := 300.0 / float64(src.Rows())

	offsetX := float64(d.region.Min.X) / float64(src.Cols())
	offsetY := 0.0

	//gocv.Resize(src, &d.sz300x300, image.Pt(300, 300), 0, 0, gocv.InterpolationNearestNeighbor)
	gocv.CvtColor(d.sz300x300, &d.sz300x300, gocv.ColorGrayToBGR)
	d.sz300x300.ConvertTo(&d.sz300x300, gocv.MatTypeCV32F)

	blob := gocv.BlobFromImage(d.sz300x300, 1.0, image.Pt(300, 300), gocv.NewScalar(104, 177, 123, 0), false, false)
	defer blob.Close()

	d.net.SetInput(blob, "")

	detBlob := d.net.Forward("")
	defer detBlob.Close()

	detections := gocv.GetBlobChannel(detBlob, 0, 0)
	defer detections.Close()

	for r := 0; r < detections.Rows(); r++ {
		confidence := detections.GetFloatAt(r, 2)
		if confidence < 0.7 {
			continue
		}

		bounds := util.Rectangle{
			Left:   float64(detections.GetFloatAt(r, 3)),
			Top:    float64(detections.GetFloatAt(r, 4)),
			Right:  float64(detections.GetFloatAt(r, 5)),
			Bottom: float64(detections.GetFloatAt(r, 6)),
		}

		// map cropped coordinates back to src frame coordinates
		bounds.Left = offsetX + bounds.Left*scaleX
		bounds.Right = offsetX + bounds.Right*scaleX

		bounds.Top = offsetY + bounds.Top*scaleY
		bounds.Bottom = offsetY + bounds.Bottom*scaleY

		face := &Face{
			Bounds:     bounds,
			Confidence: float64(confidence),
		}

		faces = append(faces, face)
	}

	d.lock.Lock()
	d.faces = faces
	d.searchStarted = t
	d.lock.Unlock()

	buf, err := gocv.IMEncode(".jpg", src)
	if err != nil {
		panic(err)
	}
	defer buf.Close()
	encoded := buf.GetBytes()
	copied := make([]byte, len(encoded))
	copy(copied, encoded)

	if len(faces) > 0 {
		d.cFaceFound.Inc()
		d.callback(faces, copied)
	}
}

func (d *Detector) setupRegion(src gocv.Mat) {
	d.lock.Lock()
	defer d.lock.Unlock()

	width := src.Cols()
	x := (width - 300) / 2

	d.region = image.Rectangle{
		Min: image.Pt(x, 0),
		Max: image.Pt(x+300, 300),
	}
}

func (d *Detector) DetectFaces(src *gocv.Mat) {
	if !d.enabled.Val() {
		return
	}

	if d.cooldown.Val() {
		return
	}

	d.cooldown.SetFor(d.cooldownPeriod)

	copied := gocv.NewMat()
	src.CopyTo(&copied)

	select {
	case d.input <- copied:
	default:
		copied.Close()
	}
}

func sigmoid(x float64) float64 {
	return 1.0 / (1 + math.Exp(-x))
}

func decay(x float64) float64 {
	return 2 * sigmoid(-0.5*x)
}

func (d *Detector) DrawFaces(drawFrame *gocv.Mat) {
	var faces []*Face

	d.lock.Lock()
	faces = append(faces, d.faces...)
	searchStarted := d.searchStarted
	region := d.region
	d.lock.Unlock()

	gocv.Rectangle(drawFrame, region, color.RGBA{R: 0, G: 128, B: 0, A: 0}, 1)

	dt := time.Now().Sub(searchStarted).Seconds()
	factor := decay(dt)
	factor = geom.Clamp(0, factor, 1)

	for _, face := range faces {
		green := color.RGBA{
			0,
			uint8(factor * 64 * 3),
			uint8(factor * 64),
			255,
		}
		face.Bounds.Draw(drawFrame, green)

		frameCoords := face.Bounds.FrameCoords(drawFrame)

		gocv.PutText(
			drawFrame,
			fmt.Sprintf(
				"%0.2f %0.3f %0.1f",
				face.Confidence,
				face.Bounds.Area(),
				face.Bounds.Theta(d.env.FOV),
			),
			image.Pt(frameCoords.Min.X, frameCoords.Min.Y),
			gocv.FontHersheySimplex,
			0.66,
			green,
			2,
		)
	}
}

func (d *Detector) EnableFor(duration time.Duration) {
	d.enabled.SetFor(duration)
}

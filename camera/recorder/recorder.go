package recorder

import (
	"fmt"
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"io"
	"math"
	"os"
	"path/filepath"
	"sync/atomic"
	"time"
)

type RecorderInfo struct {
	FileExtension string
}

type FrameRecorder interface {
	StartRecording(writer io.WriteCloser)
	StopRecording()
	Info() RecorderInfo
}

type Recorder struct {
	logger *zap.Logger

	cmdRecord     chan bool
	cmdStop       chan bool
	outdir        string
	isRecording   int32
	cleaner       *cleaner
	gRecording    prometheus.Gauge
	cBytesWritten prometheus.Counter
	frameRecorder FrameRecorder
}

var cFramesDropped_ = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "frames_dropped",
})

var cFramesWritten_ = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "frames_written",
})

type fileWriter struct {
	file          *os.File
	cBytesWritten prometheus.Counter
}

func (f *fileWriter) Close() error {
	return f.file.Close()
}

func (f *fileWriter) Write(p []byte) (n int, err error) {
	n, err = f.file.Write(p)
	f.cBytesWritten.Add(float64(n))
	return
}

func NewRecorder(
	logger *zap.Logger,
	registry *prometheus.Registry,
	frameRecorder FrameRecorder,
	outdir string,
	maxSize int64,
) *Recorder {
	c := &cleaner{
		logger:        logger,
		outdir:        outdir,
		maxSize:       maxSize,
		dryRun:        false,
		fileExtension: frameRecorder.Info().FileExtension,
	}

	registry.MustRegister(
		prometheus.NewGaugeFunc(prometheus.GaugeOpts{
			Namespace: "heads",
			Subsystem: "camera_recorder",
			Name:      "video_disk_used",
		}, func() float64 {
			space, err := c.videoDiskSpace()
			if err != nil {
				logger.Error("error calculating video space", zap.Error(err))
				return math.NaN()
			}
			return float64(space)
		}),
	)

	return &Recorder{
		logger: logger,
		outdir: outdir,

		cmdRecord: make(chan bool),
		cmdStop:   make(chan bool),

		cleaner:       c,
		frameRecorder: frameRecorder,

		gRecording:    metrics.SimpleGauge(registry, "camera_recorder", "recording"),
		cBytesWritten: metrics.SimpleCounter(registry, "camera_recorder", "bytes_written"),
	}
}

func (r *Recorder) Run() error {
	_, err := os.Stat(r.outdir)
	if os.IsNotExist(err) {
		err := os.MkdirAll(r.outdir, 0o750)
		if err != nil {
			return errors.Wrap(err, "mkdirall")
		}
	} else if err != nil {
		return errors.Wrap(err, "stat")
	}

	ch := make(chan error)

	go r.runCleaner(ch)

	go func() {
		ch <- errors.Wrap(r.mainloop(), "mainloop")
	}()

	return <-ch
}

func (r *Recorder) Record() {
	r.cmdRecord <- true
}

func (r *Recorder) Stop() {
	r.cmdStop <- true
}

func (r *Recorder) IsRecording() bool {
	return atomic.LoadInt32(&r.isRecording) != 0
}

func (r *Recorder) write() error {
	atomic.StoreInt32(&r.isRecording, 1)
	defer atomic.StoreInt32(&r.isRecording, 0)

	now := time.Now()

	dir := filepath.Join(
		r.outdir,
		now.Format("2006-01-02"),
	)

	err := os.MkdirAll(dir, 0o750)
	if err != nil {
		return errors.Wrap(err, "mkdirall")
	}

	filename := filepath.Join(
		dir,
		fmt.Sprintf(
			"%s.%s",
			now.Format("15_04_05"),
			r.frameRecorder.Info().FileExtension,
		),
	)

	writer := &fileWriter{
		cBytesWritten: r.cBytesWritten,
	}
	writer.file, err = os.OpenFile(filename, os.O_WRONLY|os.O_CREATE, 0o640)
	if err != nil {
		return err
	}
	r.frameRecorder.StartRecording(writer)

	for {
		select {
		case <-r.cmdRecord:
			// this is ok

		case <-r.cmdStop:
			r.frameRecorder.StopRecording()
			r.gRecording.Set(0)
			return nil
		}
	}
}

func (r *Recorder) mainloop() error {
	for {
		select {
		case <-r.cmdRecord:
			r.gRecording.Set(1)
			if err := r.write(); err != nil {
				return err
			}
		}
	}
}

func (r *Recorder) runCleaner(ch chan error) {
	for {
		err := r.cleaner.clean()
		if err != nil {
			ch <- err
			return
		}

		time.Sleep(5 * time.Minute)
	}
}

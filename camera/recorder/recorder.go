package recorder

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/h264"
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

const (
	naluTypeSlice = 1
	naluTypeIDR   = 5
	naluTypeSPS   = 7
	naluTypePPS   = 8
)

type sequence struct {
	sps    []byte
	pps    []byte
	idr    []byte
	slices [][]byte
}

type Recorder struct {
	logger *zap.Logger

	buf chan *sequence

	cmdRecord   chan bool
	cmdDrop     chan bool
	cmdStop     chan bool
	outdir      string
	isRecording int32
	cleaner     *cleaner
}

var cFramesDropped = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "frames_dropped",
})

var cFramesWritten = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "frames_written",
})

var cBytesWritten = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "bytes_written",
})

type fileWriter struct {
	file *os.File
}

func (f *fileWriter) Write(p []byte) (n int, err error) {
	n, err = f.file.Write(p)
	cBytesWritten.Add(float64(n))
	return
}

func init() {
	prometheus.MustRegister(cFramesDropped)
	prometheus.MustRegister(cFramesWritten)
	prometheus.MustRegister(cBytesWritten)
}

func NewRecorder(logger *zap.Logger, bufSize int, outdir string, maxSize int64) *Recorder {
	c := &cleaner{
		logger:  logger,
		outdir:  outdir,
		maxSize: maxSize,
		dryRun:  false,
	}

	// TODO: sync.Once here?
	prometheus.MustRegister(
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

		buf: make(chan *sequence, bufSize),

		cmdRecord: make(chan bool),
		cmdDrop:   make(chan bool),
		cmdStop:   make(chan bool),

		cleaner: c,
	}
}

func (r *Recorder) Run(reader io.Reader) error {
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
		ch <- errors.Wrap(r.split(reader), "split")
	}()

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

func writeNALU(writer io.Writer, b []byte) error {
	if _, err := writer.Write([]byte{0, 0, 0, 1}); err != nil {
		return err
	}
	_, err := writer.Write(b)
	return err
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
		fmt.Sprintf("%s.h264", now.Format("15_04_05")),
	)

	writer := &fileWriter{}
	writer.file, err = os.OpenFile(filename, os.O_WRONLY|os.O_CREATE, 0o640)
	if err != nil {
		return err
	}
	defer writer.file.Close() // TODO actually capture and return error

	first := true

	for {
		select {
		case <-r.cmdRecord:
			// this is ok

		case <-r.cmdDrop:
			r.logger.Warn("unexpected command", zap.String("state", "writing"), zap.String("command", "drop"))

		case <-r.cmdStop:
			// TODO: should we drain the buffer?
			return nil

		case s := <-r.buf:
			if err := r.WriteFrame(writer, first, s); err != nil {
				return errors.Wrap(err, "writeframe")
			}
			if first {
				first = false
			}
		}
	}
}

func (r *Recorder) WriteFrame(writer io.Writer, first bool, s *sequence) error {
	if first {
		if err := writeNALU(writer, s.sps); err != nil {
			return err
		}
		if err := writeNALU(writer, s.pps); err != nil {
			return err
		}
	}
	if err := writeNALU(writer, s.idr); err != nil {
		return err
	}
	for _, slice := range s.slices {
		if err := writeNALU(writer, slice); err != nil {
			return err
		}
	}
	cFramesWritten.Add(1)
	return nil
}

func (r *Recorder) dropOne() {
	select {
	case <-r.buf:
		cFramesDropped.Inc()
	default:
	}
}

func (r *Recorder) split(reader io.Reader) error {
	count := 0

	var sps []byte
	var pps []byte
	var seq *sequence

	return h264.Split(reader, func(nalu []byte) error {
		typ := nalu[0] & 0b11111

		switch typ {
		case naluTypeSPS:
			sps = nalu
		case naluTypePPS:
			pps = nalu
		case naluTypeIDR:
			if sps == nil || pps == nil {
				return errors.New("missing sps or pps")
			}
			if seq != nil {
				// TODO: handle eof (i.e., last in file)
				r.feed(seq)
			}
			seq = &sequence{
				sps: sps,
				pps: pps,
				idr: nalu,
			}
		case naluTypeSlice:
			// TODO: handle eof (i.e., last in file)
			if seq == nil {
				return errors.New("missing seq")
			} else if seq.idr == nil {
				return errors.New("missing idr")
			}
			seq.slices = append(seq.slices, nalu)
		}

		count++
		return nil
	})
}

func (r *Recorder) mainloop() error {
	for {
		select {
		case <-r.cmdDrop:
			r.logger.Warn("unexpected command", zap.String("state", "stopped"), zap.String("command", "stop"))

		case <-r.cmdRecord:
			if err := r.write(); err != nil {
				return err
			}
		case <-r.cmdDrop:
			r.dropOne()
		}
	}
}

func (r *Recorder) feed(s *sequence) {
	select {
	case r.buf <- s:
		return
	default:
	}

	r.dropOne()
	r.buf <- s
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

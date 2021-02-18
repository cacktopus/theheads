package recorder

import (
	"fmt"
	"github.com/cacktopus/theheads/camera/h264"
	"github.com/pkg/errors"
	"github.com/prometheus/client_golang/prometheus"
	"go.uber.org/zap"
	"io"
	"os"
	"path/filepath"
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

	cmdRecord chan bool
	cmdDrop   chan bool
	cmdStop   chan bool
	outdir    string
}

var droppedCounter = prometheus.NewCounter(prometheus.CounterOpts{
	Namespace: "heads",
	Subsystem: "camera_recorder",
	Name:      "dropped",
})

func init() {
	prometheus.MustRegister(droppedCounter)
}

func NewRecorder(logger *zap.Logger, bufSize int, outdir string) *Recorder {

	return &Recorder{
		logger: logger,
		outdir: outdir,

		buf: make(chan *sequence, bufSize),

		cmdRecord: make(chan bool),
		cmdDrop:   make(chan bool),
		cmdStop:   make(chan bool),
	}
}

func (r *Recorder) Run(reader io.Reader) error {
	ch := make(chan error)

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

func (r *Recorder) write() error {
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
	file, err := os.OpenFile(filename, os.O_WRONLY|os.O_CREATE, 0o640)
	if err != nil {
		return err
	}
	defer file.Close() // TODO actually capture and return error

	first := true

	writeNALU := func(b []byte) error {
		if _, err := file.Write([]byte{0, 0, 0, 1}); err != nil {
			return err
		}
		_, err := file.Write(b)
		return err
	}

	for {
		select {
		case <-r.cmdRecord:
			r.logger.Warn("unexpected command", zap.String("state", "writing"), zap.String("command", "record"))

		case <-r.cmdDrop:
			r.logger.Warn("unexpected command", zap.String("state", "writing"), zap.String("command", "drop"))

		case <-r.cmdStop:
			// TODO: should we drain the buffer?
			return nil

		case s := <-r.buf:
			if first {
				first = false
				if err := writeNALU(s.sps); err != nil {
					return err
				}
				if err := writeNALU(s.pps); err != nil {
					return err
				}
			}
			if err := writeNALU(s.idr); err != nil {
				return err
			}
			for _, slice := range s.slices {
				if err := writeNALU(slice); err != nil {
					return err
				}
			}
		}
	}
}

func (r *Recorder) dropOne() {
	select {
	case <-r.buf:
		droppedCounter.Inc()
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

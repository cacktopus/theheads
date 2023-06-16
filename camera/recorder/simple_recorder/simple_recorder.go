package simple_recorder

import (
	"io"
	"sync"
)

type Frame interface {
	Write(first bool, writer io.Writer) error
	IsValid() error
}

type Recorder struct {
	lock sync.Mutex

	bufSize  int
	frameBuf []Frame

	output chan Frame
}

func New(bufSize int) *Recorder {
	return &Recorder{
		bufSize: bufSize,
	}
}

func (r *Recorder) AddFrame(frame Frame) {
	r.lock.Lock()
	defer r.lock.Unlock()

	if r.output != nil {
		select {
		case r.output <- frame:
		default:
			// TODO: dropped frame counter
		}
	} else {
		r.bufferFrame(frame)
	}
}

func (r *Recorder) StartRecording(writer io.WriteCloser) {
	r.lock.Lock()
	defer r.lock.Unlock()

	chanSz := len(r.frameBuf) * 2
	if chanSz < 5 {
		chanSz = 5
	}

	r.output = make(chan Frame, chanSz)
	go r.write(writer, r.output)

	for _, frame := range r.frameBuf {
		r.output <- frame
	}

	r.frameBuf = nil
}

func (r *Recorder) StopRecording() {
	r.lock.Lock()
	defer r.lock.Unlock()

	close(r.output)
	r.output = nil
}

func (r *Recorder) write(writer io.WriteCloser, output chan Frame) {
	first := true
	for frame := range output {
		if err := frame.IsValid(); err != nil {
			panic(err)
		}
		frame.Write(first, writer) // errors
		first = false
	}

	writer.Close() // errors
}

func (r *Recorder) bufferFrame(frame Frame) {
	// only call while holding the lock

	// this could be more efficient with a fixed sized circular buffer
	if len(r.frameBuf) == r.bufSize {
		r.frameBuf = r.frameBuf[1:] // drop the oldest frame
	}

	r.frameBuf = append(r.frameBuf, frame)
}

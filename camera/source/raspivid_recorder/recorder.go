package raspivid_recorder

import (
	"github.com/cacktopus/theheads/camera/h264"
	"github.com/cacktopus/theheads/camera/recorder"
	"github.com/cacktopus/theheads/camera/recorder/simple_recorder"
	"io"
)

type raspiRecoder struct {
	*simple_recorder.Recorder
}

func newRecorder(bufsize int) *raspiRecoder {
	return &raspiRecoder{Recorder: simple_recorder.New(bufsize)}
}

func (r *raspiRecoder) Info() recorder.RecorderInfo {
	return recorder.RecorderInfo{FileExtension: "h264"}
}

func (r *raspiRecoder) Run(stream io.Reader) error {
	frames := make(chan *h264.Sequence)

	go func() {
		for frame := range frames {
			r.AddFrame(frame)
		}
	}()

	return h264.ParseStream(stream, frames)
}

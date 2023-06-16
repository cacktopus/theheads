package mjpeg

import (
	"bufio"
	"bytes"
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/pixiv/go-libjpeg/jpeg"
	"github.com/pkg/errors"
	"image"
	"io"
)

var StartFrameMarker = []byte{0xff, 0xd8}
var EndFrameMarker = []byte{0xff, 0xd9}

type Frame struct {
	Raw   []byte
	Image image.Image
}

func (f *Frame) Write(first bool, writer io.Writer) error {
	_, err := io.Copy(writer, bytes.NewBuffer(f.Raw))
	if err != nil {
		return errors.Wrap(err, "err")
	}
	return nil
}

func (f *Frame) IsValid() error {
	return FrameIsValid(f.Raw)
}

func FrameIsValid(frame []byte) error {
	if !bytes.Equal(frame[0:2], StartFrameMarker) {
		return errors.New("invalid start marker")
	}

	if !bytes.Equal(frame[len(frame)-2:], EndFrameMarker) {
		return errors.New("invalid end marker")
	}

	return nil
}

func DecodeMjpeg(
	env *cfg.Cfg,
	input io.Reader,
	callback func(*Frame),
) {
	scanner := bufio.NewScanner(input)
	scanner.Buffer(nil, 10_000_000)

	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 {
			return 0, nil, nil
		}

		start := bytes.Index(data, StartFrameMarker)
		if start == -1 {
			return len(data), nil, nil
		}
		if start > 0 {
			return start, nil, nil
		}

		end := bytes.Index(data, EndFrameMarker)
		if end == -1 {
			// Request more data.
			return 0, nil, nil
		}

		return end + 2, data[start : end+2], nil
	})

	scanFrame := func() *Frame {
		scanner.Scan()
		raw := scanner.Bytes()
		decode, err := jpeg.Decode(bytes.NewBuffer(raw), &jpeg.DecoderOptions{
			ScaleTarget: image.Rect(0, 0, env.Width/2, env.Height/2),
		})
		if err != nil {
			panic(err)
		}

		copied := make([]byte, len(raw))
		copy(copied, raw)

		return &Frame{
			Raw:   copied,
			Image: decode,
		}
	}

	paused := scanFrame()
	for {
		for i := 0; i < 0; i++ {
			callback(paused)
		}

		for i := 0; i < 100; i++ {
			paused = scanFrame()
			callback(paused)
		}
	}
}

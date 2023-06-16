package file

import (
	"github.com/cacktopus/theheads/camera/cfg"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gocv.io/x/gocv"
	"io"
	"testing"
)

func TestMjpegFileStreamer_Grab(t *testing.T) {
	streamer := NewMjpegFileStreamer(&cfg.Cfg{
		Height:          600,
		RecorderBufsize: 5,
		Width:           800,
	})

	grab := func() {
		mat := gocv.NewMat()
		defer mat.Close()
		err := streamer.Grab(&mat)
		require.NoError(t, err)
	}

	for i := 0; i < 10; i++ {
		grab()
	}

	rd, wr := io.Pipe()

	output := make(chan []byte)

	go func() {
		all, err := io.ReadAll(rd)
		require.NoError(t, err)

		output <- all
	}()

	streamer.StartRecording(wr)

	for i := 0; i < 20; i++ {
		grab()
	}

	streamer.StopRecording()

	all := <-output
	assert.NotZero(t, len(all))
}

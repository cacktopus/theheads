package camera

import (
	"context"
	gen "github.com/cacktopus/theheads/gen/go/heads"
	"github.com/pkg/errors"
	"io"
	"os"
	"path/filepath"
)

func (h *handler) ListRecordings(
	ctx context.Context,
	in *gen.ListRecordingsIn,
) (*gen.ListRecordingsOut, error) {
	outdir := os.ExpandEnv(h.env.Outdir)
	pattern := filepath.Join(outdir, filepath.Clean(in.Date), "*.*")

	files, err := filepath.Glob(pattern)
	if err != nil {
		return nil, errors.Wrap(err, "glob")
	}

	var result []*gen.File

	for _, filename := range files {
		stat, err := os.Stat(filename)
		if err != nil {
			return nil, errors.Wrap(err, "stat")
		}

		relFile, err := filepath.Rel(outdir, filename)
		if err != nil {
			return nil, errors.Wrap(err, "rel")
		}

		result = append(result, &gen.File{
			Filename: relFile,
			Size:     stat.Size(),
		})
	}

	return &gen.ListRecordingsOut{Files: result}, nil
}

func (h *handler) StreamFile(in *gen.StreamFileIn, server gen.Recorder_StreamFileServer) error {
	outdir := os.ExpandEnv(h.env.Outdir)
	filename := filepath.Join(outdir, filepath.Clean(in.Filename))

	buf := make([]byte, 64*1024)

	open, err := os.Open(filename)
	if err != nil {
		return errors.Wrap(err, "open")
	}

	var offset int64 = 0
	for {
		var n int
		var err error
		for n < len(buf) && err == nil {
			var nn int
			nn, err = open.Read(buf[n:])
			n += nn
		}

		if sendErr := server.Send(&gen.FileChunk{
			Data:   buf[:n],
			Offset: offset,
		}); sendErr != nil {
			return errors.Wrap(sendErr, "send")
		}

		if err == io.EOF {
			break
		}

		offset += int64(n)
	}

	return nil
}

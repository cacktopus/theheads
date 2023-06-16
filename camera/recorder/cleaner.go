package recorder

import (
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type cleaner struct {
	logger        *zap.Logger
	outdir        string
	maxSize       int64
	dryRun        bool
	fileExtension string
}

type file struct {
	path         string
	lastModified time.Time
	size         int64
}

func (c *cleaner) clean() error {
	files, err := c.gather()
	if err != nil {
		return err
	}

	sort.SliceStable(files, func(i, j int) bool {
		return files[i].lastModified.Before(files[j].lastModified)
	})

	var totalSize int64
	for _, f := range files {
		totalSize += f.size
	}

	if c.maxSize == 0 {
		// don't clean if max size unspecified
		return nil
	}

	freeSpace := c.maxSize - totalSize

	if freeSpace > 0 {
		return nil
	}

	deficit := -freeSpace
	c.logger.Debug("free space deficit for video files detected", zap.Int64("deficit", deficit))

	for _, f := range files {
		c.logger.Debug(
			"removing video file to reclaim space",
			zap.String("path", f.path),
			zap.Int64("size", f.size),
		)

		deficit -= f.size

		if !c.dryRun {
			err := os.Remove(f.path)
			if err != nil {
				return err
			}
		}

		if deficit <= 0 {
			break
		}
	}

	return nil
}

func (c *cleaner) gather() ([]*file, error) {
	var files []*file

	if err := filepath.WalkDir(c.outdir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		if !strings.HasSuffix(path, "."+c.fileExtension) {
			return nil
		}

		stat, err := os.Stat(path)
		if err != nil {
			return err
		}

		files = append(files, &file{
			path:         path,
			lastModified: stat.ModTime(),
			size:         stat.Size(),
		})

		return nil
	}); err != nil {
		return nil, err
	}

	return files, nil
}

func (c *cleaner) videoDiskSpace() (int64, error) {
	gather, err := c.gather()
	if err != nil {
		return -1, errors.Wrap(err, "gather")
	}
	var size int64
	for _, f := range gather {
		size += f.size
	}
	return size, nil
}

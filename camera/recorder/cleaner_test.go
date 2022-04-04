package recorder

import (
	"github.com/stretchr/testify/assert"
	"go.uber.org/zap"
	"os"
	"testing"
)

func Test_cleaner_clean(t *testing.T) {
	logger, _ := zap.NewProduction()

	c := &cleaner{
		logger:  logger,
		outdir:  os.ExpandEnv("$HOME/pi51"),
		maxSize: 2_000_000_000,
		dryRun:  false,
	}

	err := c.clean()
	assert.NoError(t, err)
}

package camera

import (
	"fmt"
	"go.uber.org/zap"
	"os"
	"os/exec"
	"os/user"
	"path/filepath"
	"strings"
	"time"
)

func raspiStill(logger *zap.Logger) error {
	usr, err := user.Current()
	if err != nil {
		return err
	}

	outdir := filepath.Join(usr.HomeDir, "photos")
	err = os.MkdirAll(outdir, 0750)

	filename := fmt.Sprintf("%d.jpg", time.Now().UnixNano())

	out := filepath.Join(outdir, filename)

	raspivid, err := exec.LookPath("raspistill")
	if err != nil {
		return err
	}

	args := []string{
		raspivid,
		"-vf",
		"-o", out,
	}

	logger.Info("running raspistill", zap.String("cmd", strings.Join(args, " ")))

	cmd := exec.Command(args[0], args[1:]...)
	err = cmd.Start()
	if err != nil {
		return err
	}

	err = cmd.Wait()
	if err != nil {
		return err
	}

	return nil
}

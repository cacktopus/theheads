package heads_cli

import (
	"bytes"
	"fmt"
	"github.com/pin/tftp"
	"github.com/pkg/errors"
	"io"
	"io/ioutil"
	"strings"
)

type TftpCmd struct {
	Filename string `long:"filename" required:"true"`
}

func (t *TftpCmd) Execute(args []string) error {
	if !strings.HasSuffix(t.Filename, ".bin") {
		return errors.New("invalid file")
	}

	s := tftp.NewServer(func(reqFilename string, rf io.ReaderFrom) error {
		if reqFilename != "tp_recovery.bin" {
			return errors.New("invalid file")
		}

		fmt.Println("got")

		file, err := ioutil.ReadFile(t.Filename)
		if err != nil {
			return errors.Wrap(err, "read file")
		}

		_, err = rf.ReadFrom(bytes.NewBuffer(file))
		return err
	}, nil)

	return s.ListenAndServe(":69")
}

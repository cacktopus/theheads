package heads_cli

import (
	"bytes"
	"fmt"
	"github.com/pin/tftp"
	"github.com/pkg/errors"
	"io"
	"io/ioutil"
)

type TftpCmd struct {
}

func (t *TftpCmd) Execute(args []string) error {
	s := tftp.NewServer(func(filename string, rf io.ReaderFrom) error {
		if filename != "tp_recovery.bin" {
			return errors.New("invalid file")
		}

		fmt.Println("got")

		file, err := ioutil.ReadFile(filename)
		if err != nil {
			return errors.Wrap(err, "read file")
		}

		_, err = rf.ReadFrom(bytes.NewBuffer(file))
		return err
	}, nil)

	return s.ListenAndServe(":69")
}

package main

import (
	"fmt"
	"github.com/jedisct1/go-minisign"
	"github.com/jessevdk/go-flags"
	"github.com/pkg/errors"
	"io/ioutil"
	"os"
)

var opt struct {
	PublicKeys []string `long:"public-key" required:"true"`
}

func verify(filename string, keys []string) error {
	sigfile := filename + ".minisig"

	sig, err := minisign.NewSignatureFromFile(sigfile)
	if err != nil {
		return err
	}

	for _, key := range keys {
		pub, err := minisign.NewPublicKey(key)
		if err != nil {
			return err
		}

		content, err := ioutil.ReadFile(filename)
		if err != nil {
			return err
		}

		ok, err := pub.Verify(content, sig)
		if err == nil && ok {
			return nil
		}
	}

	return errors.New("signature verify failed")
}

func exitErr(prefix string, err error) {
	if err == nil {
		return
	}

	line := err.Error()
	if prefix != "" {
		line = prefix + ": " + line
	}

	_, _ = fmt.Fprintln(os.Stderr, line)
	os.Exit(1)
}

func main() {
	args, err := flags.NewParser(&opt, flags.Default & ^flags.PrintErrors).Parse()
	exitErr("", err)

	if len(args) == 0 {
		exitErr("", errors.New("no files to verify"))
	}

	for _, filename := range args {
		err := verify(filename, opt.PublicKeys)
		exitErr("verify failed", err)
	}
}

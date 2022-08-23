package main

import (
	"aead.dev/minisign"
	"fmt"
	"golang.org/x/crypto/ssh/terminal"
	"io/ioutil"
	"os"
	"strings"
)

func sign2(rule string) {
	findUnexpected()
	keyFile := os.ExpandEnv("$HOME/.minisign/minisign.key")

	files := lsUnsigned()
	fmt.Println(strings.Join(files, "\n"))

	// TODO: check file existence before reading password
	fmt.Print("minisign password: ")
	password, err := terminal.ReadPassword(int(os.Stdin.Fd()))
	noError(err)

	pk, err := minisign.PrivateKeyFromFile(string(password), keyFile)
	noError(err)

	for _, file := range files {
		content, err := ioutil.ReadFile(file)
		noError(err)

		signature := minisign.Sign(pk, content)
		err = ioutil.WriteFile(file+".minisig", signature, 0o644)
		noError(err)
	}
}

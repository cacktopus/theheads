package heads_cli

import (
	"fmt"
	"github.com/cacktopus/theheads/common/dotenv"
	"io/ioutil"
	"os"
	"sort"
)

type Env2DictCmd struct {
}

func (opt *Env2DictCmd) Execute(args []string) error {
	content, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		return err
	}

	var lines []string
	env := dotenv.ParseEnvFromContent(string(content))
	for key, value := range env {
		lines = append(lines, fmt.Sprintf(`"%s": "%s",`, key, value))
	}

	sort.Strings(lines)

	fmt.Println("{")

	for _, line := range lines {
		fmt.Println("  " + line)
	}

	fmt.Println("}")

	return nil
}

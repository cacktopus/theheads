package dotenv

import (
	"bufio"
	"github.com/pkg/errors"
	"os"
	"strings"
)

func SetEnvFromContent(content string) error {
	env := ParseEnvFromContent(content)

	for key, value := range env {
		_, present := os.LookupEnv(key)
		if present {
			continue
		}

		err := os.Setenv(key, value)
		if err != nil {
			return errors.Wrap(err, "setenv")
		}
	}

	return nil
}

func ParseEnvFromContent(content string) map[string]string {
	env := map[string]string{}

	scanner := bufio.NewScanner(strings.NewReader(content))
	for scanner.Scan() {
		line := scanner.Text()

		pair := strings.TrimSpace(line)
		if len(pair) == 0 {
			continue
		}

		if strings.HasSuffix(pair, "#") {
			continue
		}

		parts := strings.Split(pair, "=")
		key := parts[0]
		value := strings.Join(parts[1:], "=")

		env[key] = value
	}

	return env
}

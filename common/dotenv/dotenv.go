package dotenv

import (
	"bufio"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"io/ioutil"
	"os"
	"strings"
)

func SetEnvFromContent(content string) error {
	return setEnvFromContent(content, false)
}

func setEnvFromContent(content string, override bool) error {
	env := ParseEnvFromContent(content)

	for key, value := range env {
		_, present := os.LookupEnv(key)
		if present && !override {
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

func EnvOverrideFromFile(parentLogger *zap.Logger, filename string) {
	logger := parentLogger.With(zap.String("filename", filename))
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		logger.Info("unable to load env override", zap.Error(err))
		return
	}

	err = setEnvFromContent(string(content), true)
	if err != nil {
		logger.Error("error setting env override", zap.Error(err))
		return
	}

	logger.Info("set env override")
}

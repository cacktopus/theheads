package cfg

import (
	"github.com/cacktopus/theheads/head/motor"
	"github.com/cacktopus/theheads/head/voices"
)

type Cfg struct {
	Instance    string
	Port        int  `envconfig:"default=8080"`
	FakeStepper bool `envconfig:"optional"`
	SensorPin   int  `envconfig:"default=21"`

	Motor  motor.Cfg
	Voices voices.Cfg
}

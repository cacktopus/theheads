package camera

import (
	"github.com/cacktopus/theheads/common/schema"
	"github.com/montanaflynn/stats"
	"time"
)

func (c *Camera) publishBrightness() {
	period := 5 * time.Second
	aggWindow := time.Minute
	numSamples := int(aggWindow / period)
	var samples []float64

	for range time.NewTicker(period).C {
		current := c.currentBrightness.Load()

		samples = append(samples, current)
		extra := len(samples) - numSamples
		if extra > 0 {
			samples = samples[extra:]
		}

		mean := 0.0
		if len(samples) >= numSamples {
			mean, _ = stats.Mean(samples)
		}

		c.broker.Publish(&schema.Brightness{
			Brightness:         current,
			MeanBrightness1min: mean,
			CameraName:         c.env.Instance,
		})
	}
}

package camera_feed

import (
	"github.com/cacktopus/theheads/common/broker"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/montanaflynn/stats"
	"github.com/prometheus/client_golang/prometheus"
	"sync/atomic"
	"time"
)

type Detector struct {
	broker       *broker.Broker
	dayThreshold float64

	day             uint32
	gMeanBrightness prometheus.Gauge
}

func NewDetector(b *broker.Broker, dayThreshold float64) *Detector {
	d := &Detector{
		broker:       b,
		dayThreshold: dayThreshold,
	}

	return d
}

func (d *Detector) Run() {
	msgs := d.broker.Subscribe()
	ticker := time.NewTicker(time.Minute)
	cameras := map[string]float64{}

	for {
		select {
		case msg := <-msgs:
			switch m := msg.(type) {
			case *schema.Brightness:
				if m.MeanBrightness1min > 0 {
					cameras[m.CameraName] = m.MeanBrightness1min
				}
			}
		case <-ticker.C:
			d.detect(cameras)
			cameras = map[string]float64{}
		}
	}
}

func (d *Detector) detect(cameras map[string]float64) {
	gBrightnessCameraCount.Set(float64(len(cameras)))

	if len(cameras) < 2 {
		d.setNight()
		return
	}

	var values []float64
	for _, v := range cameras {
		values = append(values, v)
	}

	mean, _ := stats.Mean(values)
	gBrightnessMean.Set(mean)

	if mean > d.dayThreshold {
		d.setDay()
	} else {
		d.setNight()
	}
}

func (d *Detector) IsDay() bool {
	return atomic.LoadUint32(&d.day) > 0
}

func (d *Detector) setDay() {
	atomic.StoreUint32(&d.day, 1)
}

func (d *Detector) setNight() {
	atomic.StoreUint32(&d.day, 0)
}

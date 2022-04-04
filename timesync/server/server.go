package server

import (
	"context"
	gen "github.com/cacktopus/theheads/common/gen/go/heads"
	"github.com/cacktopus/theheads/timesync/util"
	"github.com/prometheus/client_golang/prometheus"
)

var currentTimestamp = prometheus.NewGaugeFunc(prometheus.GaugeOpts{
	Namespace: "heads",
	Subsystem: "timesync",
	Name:      "current_timestamp",
}, util.Now)

func init() {
	prometheus.MustRegister(currentTimestamp)
}

type Handler struct {
	RTC bool
}

func (h *Handler) Time(ctx context.Context, in *gen.TimeIn) (*gen.TimeOut, error) {
	return &gen.TimeOut{
		T:      util.Now(),
		HasRtc: h.RTC,
	}, nil
}

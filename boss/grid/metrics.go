package grid

import (
	"github.com/cacktopus/theheads/common/metrics"
	"github.com/prometheus/client_golang/prometheus"
)

var (
	gActiveFocalPointCount = metrics.SimpleGauge(
		prometheus.DefaultRegisterer,
		"boss",
		"active_focal_points",
	)

	cTraceHitFocalPoint = metrics.SimpleCounter(
		prometheus.DefaultRegisterer,
		"boss",
		"trace_hit_focal_point",
	)

	cTraceGrid = metrics.SimpleCounter(
		prometheus.DefaultRegisterer,
		"boss",
		"trace_grid",
	)

	cMaybeSpawnFocalPoint = metrics.SimpleCounter(
		prometheus.DefaultRegisterer,
		"boss",
		"maybe_spawn_focal_point",
	)

	cNewFPOverlapsExisting = metrics.SimpleCounter(
		prometheus.DefaultRegisterer,
		"boss",
		"new_focal_point_overlaps_existing",
	)

	cNewFPOverlapsCamera = metrics.SimpleCounter(
		prometheus.DefaultRegisterer,
		"boss",
		"new_focal_point_overlaps_camera",
	)

	gFocus = metrics.SimpleGauge(
		prometheus.DefaultRegisterer,
		"boss",
		"focus",
	)

	gFocusSum = metrics.SimpleGauge(
		prometheus.DefaultRegisterer,
		"boss",
		"focus_sum",
	)

	gFocusMax = metrics.SimpleGauge(
		prometheus.DefaultRegisterer,
		"boss",
		"focus_max",
	)
)

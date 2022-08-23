package grid

import (
	"github.com/cacktopus/theheads/common/geom"
	"github.com/cacktopus/theheads/common/schema"
	"math"
	"time"
)

const (
	DefaultTTL     = 5 * time.Second
	DefaultTTLLast = 30 * time.Second
)

// Internal representation
type focalPoint struct {
	pos       geom.Vec
	radius    float64
	id        string
	updatedAt time.Time
	ttl       time.Duration // time to live if more than one focal point present
	ttlLast   time.Duration // time to live for last focal point
}

func NewFocalPoint(pos geom.Vec, radius float64, id string, ttl, ttlLast time.Duration) *focalPoint {
	return &focalPoint{
		pos:       pos,
		radius:    radius,
		id:        id,
		updatedAt: time.Now(),
		ttl:       ttl,
		ttlLast:   ttlLast,
	}
}

func (fp *focalPoint) ToMsg() *schema.FocalPoint {
	return &schema.FocalPoint{
		Name:   fp.id,
		Pos:    schema.Pos{X: fp.pos.X(), Y: fp.pos.Y()},
		Radius: fp.radius,
		Ttl:    float64(fp.ttl / time.Second),
	}
}

func (fp *focalPoint) expiry(globalFocalPointCount int) time.Time {
	if globalFocalPointCount > 1 {
		return fp.updatedAt.Add(fp.ttl)
	}
	return fp.updatedAt.Add(fp.ttlLast)
}

func (fp *focalPoint) overlaps(other *focalPoint, scale float64) bool {
	to := other.pos.Sub(fp.pos)
	d := to.Abs()
	return d < (fp.radius+other.radius)*scale
}

func (fp *focalPoint) refresh() {
	fp.updatedAt = time.Now()
}

func (fp *focalPoint) isExpired(globalFocalPointCount int) bool {
	t := time.Now()
	return t.After(fp.expiry(globalFocalPointCount))
}

func sq(a float64) float64 {
	return a * a
}

func (fp *focalPoint) lineIntersection(p0 geom.Vec, p1 geom.Vec) (geom.Vec, geom.Vec, bool) {
	// transform to circle's reference frame

	p0 = p0.Sub(fp.pos)
	p1 = p1.Sub(fp.pos)

	x0, y0 := p0.X(), p0.Y()
	x1, y1 := p1.X(), p1.Y()

	r := fp.radius

	a := sq(x1-x0) + sq(y1-y0)
	b := 2*(x1-x0)*x0 + 2*(y1-y0)*y0
	c := sq(x0) + sq(y0) - sq(r)

	disc := b*b - 4*a*c
	if disc < 0 {
		return geom.ZeroVec(), geom.ZeroVec(), false
	}

	rt := math.Sqrt(disc)
	t0 := (-b - rt) / (2 * a)
	t1 := (-b + rt) / (2 * a)

	t0, t1 = math.Min(t0, t1), math.Max(t0, t1)

	// may want to revist these conditions later
	if t0 < 0 || t1 < 0 {
		return geom.ZeroVec(), geom.ZeroVec(), false
	}

	if t0 > 1 || t1 > 1 {
		return geom.ZeroVec(), geom.ZeroVec(), false
	}

	q0 := p1.Sub(p0).Scale(t0).Add(p0)
	q1 := p1.Sub(p0).Scale(t1).Add(p0)

	// translate back to global reference frame
	q0 = q0.Add(fp.pos)
	q1 = q1.Add(fp.pos)

	return q0, q1, true
}

package grid

import (
	"github.com/cacktopus/theheads/boss/broker"
	"github.com/cacktopus/theheads/boss/geom"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/sirupsen/logrus"
	"math"
	"sync"
)

type focalPoints struct {
	focalPoints map[string]*focalPoint
	lock        sync.Mutex
	broker      *broker.Broker
	scene       *scene.Scene
}

func (fps *focalPoints) withLock(callback func()) {
	fps.lock.Lock()
	defer fps.lock.Unlock()
	callback()
}

func (fps *focalPoints) traceFocalPoints(p0, p1 geom.Vec) bool {
	minDist := maxFloat
	var minFp *focalPoint
	var m0, m1 geom.Vec

	fps.withLock(func() {
		for _, fp := range fps.focalPoints {
			q0, q1, hit := fp.lineIntersection(p0, p1)
			if hit {
				d := q0.Sub(p0).AbsSq()
				if d < minDist {
					m0, m1 = q0, q1
					minDist = d
					minFp = fp
				}
			}
		}
	})

	// only interact with closest fp
	if minFp != nil {
		midpoint := m0.Add(m1.Sub(m0).Scale(0.5))
		to := midpoint.Sub(minFp.pos)
		minFp.pos = minFp.pos.Add(to.Scale(fps.scene.CameraSensitivity))
		minFp.refresh()
		return true
	}

	return false
}

func (fps *focalPoints) mergeOverlappingFocalPoints() {
	// this runs every update and we can tolerate some overlap, so to keep things simple,
	// if we find a single overlap just deal with it and get to any other overlaps on the
	// next run
	fps.withLock(func() {
		for _, fp0 := range fps.focalPoints {
			for id, fp1 := range fps.focalPoints {
				if fp0 == fp1 {
					continue
				}
				if fp0.overlaps(fp1, 0.5) {
					// midpoint = (fp0.pos + fp1.pos).scale(0.5
					midpoint := fp0.pos.Add(fp1.pos).Scale(0.5)
					fp0.pos = midpoint
					delete(fps.focalPoints, id)
					activeFocalPointCount.Dec()
				}
			}
		}
	})
}

func (fps *focalPoints) publishFocalPoints() {
	var points []*schema.FocalPoint
	fps.withLock(func() {
		for _, fp := range fps.focalPoints {
			points = append(points, fp.ToMsg())
		}
	})

	msg := schema.FocalPoints{
		FocalPoints: points,
	}

	fps.broker.Publish(msg)
}

func (fps *focalPoints) getFocalPoints() []*FocalPoint {
	var result []*FocalPoint
	fps.withLock(func() {
		for _, fp := range fps.focalPoints {
			result = append(result, fp.ToExternal())
		}
	})
	return result
}

func (fps *focalPoints) cleanupStale() {
	var toRemove []string
	fps.withLock(func() {
		for id, fp := range fps.focalPoints {
			if fp.isExpired(len(fps.focalPoints)) {
				toRemove = append(toRemove, id)
			}
		}

		for _, id := range toRemove {
			delete(fps.focalPoints, id)
			activeFocalPointCount.Dec()
		}
	})

	fps.publishFocalPoints()
}
func (fps *focalPoints) closestFocalPointTo(p geom.Vec) (*FocalPoint, float64) {
	minDist := maxFloat
	var minFp *FocalPoint

	fps.withLock(func() {
		for _, fp := range fps.focalPoints {
			d2 := fp.pos.Sub(p).AbsSq()
			if d2 < 1e-5 {
				continue
			}
			if d2 < minDist {
				minDist = d2
				minFp = fp.ToExternal()
			}
		}
	})

	if minFp != nil {
		return minFp, math.Sqrt(minDist)
	}

	return nil, -1
}

func (fps *focalPoints) maybeSpawnFocalPoint(p geom.Vec) {
	newFp := NewFocalPoint(p, fpRadius, "", DefaultTTL, DefaultTTLLast)

	for _, cam := range fps.scene.Cameras {
		fakeFp := NewFocalPoint(cam.M.Translation(), fpRadius, "", DefaultTTL, DefaultTTLLast)
		if newFp.overlaps(fakeFp, 1.0) {
			return
		}
	}

	fps.withLock(func() {
		for _, fp := range fps.focalPoints {
			if newFp.overlaps(fp, 1.0) {
				return
			}
		}

		// create new focal point
		newFp.id = assignID()
		fps.focalPoints[newFp.id] = newFp
		activeFocalPointCount.Inc()
		logrus.WithField("pos", p.AsStr()).Debug("Spawning new focal point")
	})

	fps.publishFocalPoints()
}

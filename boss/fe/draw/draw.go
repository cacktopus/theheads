package draw

import (
	"fmt"
	"github.com/cacktopus/theheads/boss/fe/reaper"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/common/schema"
	"syscall/js"
	"time"
)

type Empty struct{}

type Draw struct {
	heads       map[string]js.Value
	cameras     map[string]js.Value
	focalPoints map[string]js.Value

	reaper  *reaper.Reaper
	svgRoot js.Value
	scene   *scene.Scene
}

func New(svgRoot js.Value, sc *scene.Scene) *Draw {
	result := &Draw{
		reaper:      reaper.NewReaper(),
		svgRoot:     svgRoot,
		scene:       sc,
		heads:       map[string]js.Value{},
		cameras:     map[string]js.Value{},
		focalPoints: map[string]js.Value{},
	}

	go result.reaper.Run()

	result.setup()

	return result
}

func (h *Draw) HeadPositioned(req *schema.HeadPositioned, resp *Empty) error {
	head, ok := h.heads[req.HeadName]
	if ok {
		head.Call("rotate", req.Rotation)
	}
	resp = &Empty{}
	return nil
}

func (h *Draw) MotionDetected(req *schema.MotionDetected, resp *Empty) error {
	camera, ok := h.cameras[req.CameraName]
	if ok {
		ray := camera.Call("line", 0, 0, 5, 0).Call("stroke", map[string]interface{}{
			"width":   0.020,
			"color":   "lightgreen",
			"opacity": 0.40,
		})
		ray.Call("rotate", req.Position, 0, 0)
		h.reaper.Add("", time.Now().Add(250*time.Millisecond), func() {
			ray.Call("remove")
		})
	}
	resp = &Empty{}
	return nil
}

func (h *Draw) deleteFocalPoints(req *schema.FocalPoints) {
	allKeys := map[string]bool{}
	for _, fp := range req.FocalPoints {
		allKeys[fp.Name] = true
	}

	var toDelete []string
	for k := range h.focalPoints {
		if !allKeys[k] {
			toDelete = append(toDelete, k)
		}
	}

	for _, k := range toDelete {
		obj := h.focalPoints[k]
		obj.Call("remove")
		delete(h.focalPoints, k)
	}
}

func (h *Draw) FocalPoints(req *schema.FocalPoints, resp *Empty) error {
	h.deleteFocalPoints(req)

	for _, fp := range req.FocalPoints {
		key := "fp-" + fp.Name

		if _, ok := h.focalPoints[key]; !ok {
			circle := h.svgRoot.Call("circle", 0).Call("radius", fp.Radius)
			circle.Call("attr", map[string]interface{}{
				"stroke":       "#fff",
				"stroke-width": 0.020,
				"fill-opacity": 0.0,
			})
			h.focalPoints[key] = circle
		}

		circle := h.focalPoints[key]
		circle.Call("center", fp.Pos.X, fp.Pos.Y)
	}

	resp = &Empty{}
	return nil
}

func (h *Draw) setup() {
	for _, stand := range h.scene.Stands {
		h.drawStand(stand)
	}
}

func (h *Draw) drawStand(stand *scene.Stand) {
	fmt.Println(stand.Name)
	moved := h.svgRoot.Call("group")
	moved.Call("dmove", stand.Pos.X, stand.Pos.Y)

	rotated := moved.Call("group")
	rotated.Call("rotate", stand.Rot, 0, 0)

	radius := 0.20

	for _, head := range stand.Heads {
		g2 := rotated.Call("group")
		circle := g2.Call("circle", 0).Call("radius", radius)
		circle.Call("attr", map[string]interface{}{
			"fill":         "#806",
			"stroke":       "#000",
			"stroke-width": 0.020,
		})

		g2.Call("line", 0, 0, radius, 0).Call("stroke", map[string]interface{}{
			"width": 0.020,
			"color": "white",
		})

		text := moved.Call("text", stand.Heads[0].Name).Call("attr", map[string]interface{}{
			"fill": "darkgreen",
		}).Call("font", map[string]interface{}{
			"size": 0.1,
		})
		text.Call("scale", 1, -1, 0, 0)
		text.Call("center", 0, -1.4*radius)

		h.heads[head.Name] = g2
	}

	for _, camera := range stand.Cameras {
		g2 := rotated.Call("group")
		g2.Call("move", camera.Pos.X, camera.Pos.Y)

		h.cameras[camera.Name] = g2
	}
}

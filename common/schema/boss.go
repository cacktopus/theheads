package schema

import "encoding/json"

// TODO: consolidate all messages (c.f. camera::schema)

type HeadEvent struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type Pos struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type FocalPoint struct {
	Name string  `json:"name"`
	Pos  Pos     `json:"pos"`
	Ttl  float64 `json:"ttl"`
}

type FocalPoints struct {
	FocalPoints []*FocalPoint `json:"focal_points"`
}

func (FocalPoints) Name() string {
	return "focal-points"
}

type MotionLine struct {
	P0 [2]float64 `json:"p0"`
	P1 [2]float64 `json:"p1"`
}

func (MotionLine) Name() string {
	return "motion-line"
}

type Extra struct {
	HeadName     string  `json:"headName"`
	StepPosition int     `json:"stepPosition"`
	Rotation     float64 `json:"rotation"`
}

type Active struct {
	Component string `json:"component"`
	Name_     string `json:"name"`
	Extra     Extra  `json:"extra"`
}

func (Active) Name() string {
	return "active"
}

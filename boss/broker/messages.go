package broker

import "encoding/json"

type HeadEvent struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type MotionDetected struct {
	CameraName string  `json:"cameraName"`
	Position   float64 `json:"position"`
}

func (MotionDetected) Name() string {
	return "motion-detected"
}

type HeadPositioned struct {
	HeadName     string  `json:"headName"`
	StepPosition float32 `json:"stepPosition"`
	Rotation     float32 `json:"rotation"`
}

func (HeadPositioned) Name() string {
	return "head-positioned"
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

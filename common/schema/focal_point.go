package schema

type FocalPoint struct {
	Name   string
	Pos    Pos
	Radius float64
	Ttl    float64
}

type FocalPoints struct {
	FocalPoints []*FocalPoint
}

func (*FocalPoints) Name() string {
	return "focal-points"
}

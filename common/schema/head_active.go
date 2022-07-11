package schema

type Extra struct {
	HeadName     string
	StepPosition int
	Rotation     float64
}

type Active struct {
	Component string
	HeadName  string
	Extra     Extra
}

func (*Active) Name() string {
	return "active"
}

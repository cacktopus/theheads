package schema

type HeadPositioned struct {
	HeadName     string
	StepPosition float32
	Rotation     float32
}

func (*HeadPositioned) Name() string {
	return "head-positioned"
}

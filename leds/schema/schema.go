package schema

type ReceivedIR struct {
	Value int32
}

func (*ReceivedIR) Name() string {
	return "received-ir"
}

type Status struct {
	Scale float64
}

func (*Status) Name() string {
	return "status"
}

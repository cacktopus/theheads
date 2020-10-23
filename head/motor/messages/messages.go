package messages

type Message struct {
	Type string `json:"type"`
	Data *Data  `json:"data"`
}

type Extra struct {
	HeadName     string  `json:"headName"`
	StepPosition int     `json:"stepPosition"`
	Rotation     float64 `json:"rotation"`
}

type Data struct {
	Component string `json:"component"`
	Name      string `json:"name"`
	Extra     *Extra `json:"extra"`
}

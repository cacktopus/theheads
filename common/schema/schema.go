package schema

type HeadResult struct {
	Result     string  `json:"result"`
	Position   int     `json:"position"`
	Rotation   float64 `json:"rotation"`
	Controller string  `json:"controller"`
	StepsAway  int     `json:"steps_away"`
	Eta        float64 `json:"eta"`
}

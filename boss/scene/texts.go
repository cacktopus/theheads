package scene

import (
	"encoding/json"
	"math/rand"
	"path"
)

type Text struct {
	Title    string    `json:"title"`
	Content  []Content `json:"content"`
	Disabled bool      `json:"disabled"`
}
type Content struct {
	ID       string  `json:"id"`
	Duration float64 `json:"duration"`
}

func LoadTexts(scenePath, textSet string) []*Text {
	var result []*Text

	texts, err := getPrefix(path.Join(scenePath, "texts", textSet))
	if err != nil {
		panic(err)
	}

	if len(texts) == 0 {
		panic("no texts found")
	}

	for _, t := range texts {
		text := Text{}
		err := json.Unmarshal(t, &text)
		if err != nil {
			panic(err)
		}
		if !text.Disabled {
			result = append(result, &text)
		}
	}

	return result
}

func RandomText(texts []*Text) *Text {
	i := rand.Intn(len(texts))
	return texts[i]
}

package main

import (
	"encoding/json"
	"github.com/cacktopus/theheads/boss/config"
	"github.com/hashicorp/consul/api"
	"math/rand"
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

func LoadTexts(consulClient *api.Client) []*Text {
	var result []*Text

	texts, err := config.GetPrefix(consulClient, "/the-heads/texts")

	if err != nil {
		panic(err)
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

func randomText(texts []*Text) *Text {
	i := rand.Intn(len(texts))
	return texts[i]
}

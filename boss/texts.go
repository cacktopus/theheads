package main

import (
	"encoding/json"
	"github.com/cacktopus/heads/boss/config"
	"github.com/hashicorp/consul/api"
)

type Text struct {
	Title   string    `json:"title"`
	Content []Content `json:"content"`
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

	text := Text{}
	for _, t := range texts {
		err := json.Unmarshal(t, &text)
		if err != nil {
			panic(err)
		}
		result = append(result, &text)
	}

	return result
}

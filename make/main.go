package main

import (
	"fmt"
	"github.com/vrischmann/envconfig"
	"os"
	"sort"
)

var cfg = &Cfg{}

func main() {
	err := envconfig.Init(cfg)
	if err != nil {
		panic(err)
	}

	cfg.SharedFolder = os.ExpandEnv(cfg.SharedFolder)

	if len(os.Args) == 1 {
		var ruleList []string
		for rule, _ := range rules {
			ruleList = append(ruleList, rule)
		}
		sort.Strings(ruleList)
		for _, rule := range ruleList {
			fmt.Println(rule)
		}
		return
	}

	for _, target := range os.Args[1:] {
		f := rules[target]
		f(target)
	}
}

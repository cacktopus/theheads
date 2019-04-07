package cpumon

import (
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
)

func ParseProc(pid int, fieldNo int) float64 {
	stat := fmt.Sprintf("/proc/%d/stat", pid)
	fp, err := os.Open(stat)
	if err != nil {
		panic(err)
	}

	raw, err := ioutil.ReadAll(fp)
	if err != nil {
		panic(err)
	}

	parts := strings.Fields(string(raw))
	value, err := strconv.ParseFloat(parts[fieldNo], 64)
	if err != nil {
		panic(err)
	}

	return value
}

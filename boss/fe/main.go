package main

import (
	"encoding/json"
	"fmt"
	"github.com/cacktopus/theheads/boss/fe/draw"
	"github.com/cacktopus/theheads/boss/scene"
	"github.com/cacktopus/theheads/common/wsrpc/client"
	"sync"
	"syscall/js"
)

func main() {
	fmt.Println("hello")

	var loaded sync.WaitGroup

	loadScript("svg.js", &loaded) // use svg.js 2.x
	loadScript("installation.js", &loaded)

	loaded.Wait()
	fmt.Println("loaded")

	const (
		w = 1000
		h = 800
	)

	svg := js.Global().Call("SVG", "drawing").Call("size", w, h)
	svg.Call("rect", w, h).Call("attr", map[string]interface{}{
		"fill": "black",
	})

	root := svg.Call("group")
	scale := 33

	root.Call("move", w/2, 100)
	root.Call("scale", scale, -scale, 0, 0)

	const grid = 10
	for x := -grid; x <= grid; x++ {
		root.Call("line", x, -grid, x, grid).Call("stroke", map[string]interface{}{
			"width": 0.020,
			"color": "darkgrey",
		})
	}

	for y := -grid; y <= grid; y++ {
		root.Call("line", -grid, y, grid, y).Call("stroke", map[string]interface{}{
			"width": 0.020,
			"color": "darkgrey",
		})
	}

	root.Call("line", 0, 0, 1, 0).Call("stroke", map[string]interface{}{
		"width": 0.040,
		"color": "red",
	})

	root.Call("line", 0, 0, 0, 1).Call("stroke", map[string]interface{}{
		"width": 0.040,
		"color": "lightgreen",
	})

	sceneJson := getJson("/installation/dev/scene.json")
	fmt.Println(string(sceneJson))

	sc := &scene.Scene{}

	err := json.Unmarshal(sceneJson, sc)
	if err != nil {
		panic(err)
	}

	setupWSClient(draw.New(root, sc))

	select {}
}

func setupWSClient(draw *draw.Draw) {
	location := js.Global().Get("window").Get("location")
	hostname := location.Get("hostname").String()
	port := location.Get("port").String()
	url := fmt.Sprintf("ws://%s:%s/ws2", hostname, port)
	fmt.Println(url)

	wsclient := client.New(url)

	err := wsclient.Register(draw)
	if err != nil {
		panic(err)
	}

	wsclient.Connect()
}

func getJson(url string) []byte {
	// TODO: handle errors, timeouts
	body := make(chan []byte)
	xhr := js.Global().Get("XMLHttpRequest").New()
	xhr.Set("onreadystatechange", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		readyState := xhr.Get("readyState")
		done := js.Global().Get("XMLHttpRequest").Get("DONE")
		if readyState.Equal(done) {
			resp := xhr.Get("responseText").String()
			body <- []byte(resp)
		}
		return nil
	}))
	xhr.Call("open", "GET", url, true)
	xhr.Call("send", nil)
	return <-body
}

func loadScript(src string, loaded *sync.WaitGroup) {
	loaded.Add(1)
	document := js.Global().Get("document")
	script := document.Call("createElement", "script")
	script.Set("src", src)

	script.Set("onload", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		fmt.Println("loaded", src)
		loaded.Done()
		return nil
	}))

	script.Set("onerror", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		panic("loading " + src)
	}))

	document.Get("head").Call("append", script)
}

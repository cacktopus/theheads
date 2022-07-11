package main

import (
	"syscall/js"
)

type scrollingTable struct {
	document   js.Value
	body       js.Value
	autoScroll bool
	header     []string
	tbody      js.Value
}

func newScrollingTable(document js.Value, header []string) *scrollingTable {
	result := &scrollingTable{
		document: document,
		header:   header,
	}

	result.setup()

	return result
}

func (st *scrollingTable) setup() {
	st.body = st.document.Get("body")
	table := st.document.Call("createElement", "table")
	st.body.Call("appendChild", table)

	thead := st.document.Call("createElement", "thead")
	table.Call("appendChild", thead)
	row := thead.Call("insertRow", -1)

	for _, h := range st.header {
		th := st.document.Call("createElement", "th")
		th.Set("innerText", h)
		row.Call("appendChild", th)
	}

	st.tbody = st.document.Call("createElement", "tbody")
	table.Call("appendChild", st.tbody)

	st.autoScroll = true
}

func (st *scrollingTable) appendRow(row []string) {
	newRow := st.tbody.Call("insertRow", -1)

	for _, col := range row {
		newCell := newRow.Call("insertCell", -1)
		newCell.Set("innerText", col)
	}

	st.body.Set("onscroll", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		windowY := js.Global().Get("window").Get("scrollY").Int()
		clientHeight := st.body.Get("clientHeight").Int()
		max := st.body.Get("scrollHeight").Int()

		cur := windowY + clientHeight

		// TODO: do I need to think about locking, etc., here?
		st.autoScroll = max-cur < 5

		return nil
	}))

	if st.autoScroll {
		height := st.body.Get("scrollHeight").Int()
		st.body.Call("scrollTo", 0, height)
	}
}

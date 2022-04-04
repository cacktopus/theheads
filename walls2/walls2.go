package main

import (
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"github.com/hpinc/go3mf"
	"github.com/paulmach/orb"
	mr "github.com/toanqng/martinez-rueda"
	"os"
)

const (
	width  = 146
	height = 79
)

func gen() {
	p := mr.NewPolygon([]mr.Contour{
		mr.NewContour([]orb.Point{
			{},
			{},
			{},
			{},
		}),
	})

	fmt.Println(spew.Sdump(p))
}

func read() {
	var model go3mf.Model
	r, _ := go3mf.OpenReader(os.Args[1])
	err := r.Decode(&model)
	noError(err)
	for _, item := range model.Build.Items {
		fmt.Println("item:", spew.Sdump(*item))
		obj, _ := model.FindObject(item.ObjectPath(), item.ObjectID)
		//fmt.Println("object:", spew.Sdump(*obj))
		if obj.Mesh != nil {
			fmt.Println(len(obj.Mesh.Triangles.Triangle))
			for _, t := range obj.Mesh.Triangles.Triangle {
				fmt.Println(spew.Sdump(t))
			}
			for _, v := range obj.Mesh.Vertices.Vertex {
				fmt.Println(v.X(), v.Y(), v.Z())
			}
		}
	}

	w, err := go3mf.CreateWriter(os.Args[2])
	noError(err)
	noError(w.Encode(&model))
	noError(w.Close())
}

func noError(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	read()
}

package scene

import (
	"github.com/cacktopus/heads/boss/geom"
	"gonum.org/v1/gonum/mat"
)

var Json = `
{
  "stands": [
    {
      "cameras": [
        {
          "description": "Raspberry Pi PiNoir Camera V2 Video Module",
          "fov": 64.33,
          "name": "camera-42",
          "pos": {
            "x": 0.15,
            "y": 0
          },
          "rot": 0
        }
      ],
      "kinects": [],
      "heads": [
        {
          "name": "head-42",
          "pos": {
            "x": 0,
            "y": 0
          },
          "rot": 0,
          "virtual": true
        }
      ],
      "name": "stand-01",
      "pos": {
        "x": -1,
        "y": 0
      },
      "rot": -90
    },
    {
      "cameras": [
        {
          "description": "Raspberry Pi PiNoir Camera V2 Video Module",
          "fov": 64.33,
          "name": "camera-43",
          "pos": {
            "x": 0.15,
            "y": 0
          },
          "rot": 0
        }
      ],
      "kinects": [],
      "heads": [
        {
          "name": "head-43",
          "pos": {
            "x": 0,
            "y": 0
          },
          "rot": 0,
          "virtual": true
        }
      ],
      "name": "stand-02",
      "pos": {
        "x": 1,
        "y": 0
      },
      "rot": -90
    }
  ],
  "scale": 75,
  "translate": {
    "x": 750,
    "y": 100
  },
  "scenes": [
    "follow_evade"
  ],
  "startup_scenes": []
}
`

type Scene struct {
	Stands        []Stand       `json:"stands"`
	Scale         int           `json:"scale"`
	Translate     Translate     `json:"translate"`
	Scenes        []string      `json:"scenes"`
	StartupScenes []interface{} `json:"startup_scenes"`

	Cameras map[string]Camera
}
type Pos struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
type Camera struct {
	Description string  `json:"description"`
	Fov         float64 `json:"fov"`
	Name        string  `json:"name"`
	Pos         Pos     `json:"pos"`
	Rot         float64 `json:"rot"`
	M           *mat.Dense
	Stand       *Stand
}
type Head struct {
	Name    string `json:"name"`
	Pos     Pos    `json:"pos"`
	Rot     int    `json:"rot"`
	Virtual bool   `json:"virtual"`
}
type Stand struct {
	Cameras []Camera      `json:"cameras"`
	Kinects []interface{} `json:"kinects"`
	Heads   []Head        `json:"heads"`
	Name    string        `json:"name"`
	Pos     Pos           `json:"pos"`
	Rot     float64       `json:"rot"`
	M       *mat.Dense
}
type Translate struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (sc *Scene) Denormalize() {
	sc.Cameras = map[string]Camera{}
	for _, st := range sc.Stands {
		st.M = geom.ToM(st.Pos.X, st.Pos.Y, st.Rot)

		for _, c := range st.Cameras {
			if _, ok := sc.Cameras[c.Name]; ok {
				panic("Duplicate camera")
			}
			c.Stand = &st
			c.M = geom.ToM(c.Pos.X, c.Pos.Y, c.Rot)
			sc.Cameras[c.Name] = c
		}
	}
}

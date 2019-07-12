package main

var sceneJson = `
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
	Y int     `json:"y"`
}
type Camera struct {
	Description string  `json:"description"`
	Fov         float64 `json:"fov"`
	Name        string  `json:"name"`
	Pos         Pos     `json:"pos"`
	Rot         int     `json:"rot"`
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
	Rot     int           `json:"rot"`
}
type Translate struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (s *Scene) Denormalize() {
	s.Cameras = map[string]Camera{}
	for _, st := range s.Stands {
		for _, c := range st.Cameras {
			if _, ok := s.Cameras[c.Name]; ok {
				panic("Duplicate camera")
			}
			s.Cameras[c.Name] = c
		}
	}
}

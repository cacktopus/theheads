package scene

import (
	"errors"
	"fmt"
	"github.com/cacktopus/heads/boss/config"
	"github.com/cacktopus/heads/boss/geom"
	consulApi "github.com/hashicorp/consul/api"
	"gopkg.in/yaml.v2"
	"math"
)

type Scene struct {
	Stands        []*Stand      `json:"stands"`
	Scale         int           `json:"scale"`
	Translate     Translate     `json:"translate"`
	Scenes        []string      `json:"scenes"`
	StartupScenes []interface{} `json:"startup_scenes"`

	Cameras map[string]*Camera `json:"-"`
	Heads   map[string]*Head   `json:"-"`
}
type Pos struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
type Camera struct {
	Description string   `json:"description"`
	Fov         float64  `json:"fov"`
	Name        string   `json:"name"`
	Pos         Pos      `json:"pos"`
	Rot         float64  `json:"rot"`
	M           geom.Mat `json:"-"`
	Stand       *Stand   `json:"-"`
}
type Head struct {
	Name    string   `json:"name"`
	Pos     Pos      `json:"pos"`
	Rot     float64  `json:"rot"`
	Virtual bool     `json:"virtual"`
	M       geom.Mat `json:"-"`
	MInv    geom.Mat `json:"-"`
	Stand   *Stand   `json:"-"`
}
type Stand struct {
	CameraNames []string `json:"-" yaml:"cameras"`
	HeadNames   []string `json:"-" yaml:"heads"`

	Name string   `json:"name"`
	Pos  Pos      `json:"pos"`
	Rot  float64  `json:"rot"`
	M    geom.Mat `json:"-"`

	Disabled bool
	Enabled  bool

	Cameras []*Camera `json:"cameras" yaml:"-"`
	Heads   []*Head   `json:"heads" yaml:"-"`
}
type Translate struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (h *Head) GlobalPos() geom.Vec {
	return h.Stand.M.Mul(h.M).Translation()
}
func (h *Head) PointAwayFrom(p geom.Vec) float64 {
	return math.Mod(h.PointTo(p)+180.0+360.0, 360.0)
}

func (h *Head) PointTo(p geom.Vec) float64 {
	to := h.MInv.MulVec(p)
	theta := math.Atan2(to.Y(), to.X()) * 180 / math.Pi
	return math.Mod(theta+360.0, 360)
}

func BuildInstallation(consulClient *consulApi.Client) (*Scene, error) {
	scene := &Scene{
		Cameras: map[string]*Camera{},
		Heads:   map[string]*Head{},
	}

	// Cameras
	cameraYAML, err := config.GetPrefix(consulClient, "/the-heads/cameras")
	if err != nil {
		return nil, err
	}

	for _, yml := range cameraYAML {
		camera := &Camera{}
		err := yaml.Unmarshal(yml, &camera)
		if err != nil {
			return nil, err
		}

		camera.M = geom.ToM(camera.Pos.X, camera.Pos.Y, camera.Rot)
		scene.Cameras[camera.Name] = camera
	}

	// Heads
	headYAML, err := config.GetPrefix(consulClient, "/the-heads/heads")
	if err != nil {
		return nil, err
	}
	for _, yml := range headYAML {
		head := &Head{}
		err := yaml.Unmarshal(yml, &head)
		if err != nil {
			return nil, err
		}

		head.M = geom.ToM(head.Pos.X, head.Pos.Y, head.Rot)
		scene.Heads[head.Name] = head
	}

	// Stands
	standYAML, err := config.GetPrefix(consulClient, "/the-heads/stands")
	if err != nil {
		return nil, err
	}

	for _, yml := range standYAML {
		stand := &Stand{Enabled: true}
		err := yaml.Unmarshal(yml, &stand)
		if err != nil {
			return nil, err
		}

		if stand.Disabled || !stand.Enabled {
			continue
		}

		stand.M = geom.ToM(stand.Pos.X, stand.Pos.Y, stand.Rot)

		for _, name := range stand.CameraNames {
			camera, ok := scene.Cameras[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			camera.Stand = stand
			stand.Cameras = append(stand.Cameras, camera)
		}

		for _, name := range stand.HeadNames {
			head, ok := scene.Heads[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			head.Stand = stand
			head.MInv = head.Stand.M.Mul(head.M).Inv() // hmmmm, we use Stand.M for MInv but not for head.M
			stand.Heads = append(stand.Heads, head)
		}

		scene.Stands = append(scene.Stands, stand)
	}

	fmt.Println(scene)

	return scene, nil
}

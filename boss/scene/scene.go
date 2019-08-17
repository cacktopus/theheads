package scene

import (
	"errors"
	"fmt"
	"github.com/cacktopus/heads/boss/config"
	"github.com/cacktopus/heads/boss/geom"
	consulApi "github.com/hashicorp/consul/api"
	"gopkg.in/yaml.v2"
	"math"
	"math/rand"
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

func SelectHeads(
	heads map[string]*Head,
	predicate func(i int, h *Head) bool,
) (result []*Head) {
	i := 0
	for _, head := range heads {
		if predicate(i, head) {
			result = append(result, head)
		}
		i++
	}
	return
}

func RandomHeads(heads map[string]*Head) (result []*Head) {
	for _, head := range heads {
		result = append(result, head)
	}
	rand.Shuffle(len(result), func(i, j int) {
		result[i], result[j] = result[j], result[i]
	})
	return
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

	CameraMap map[string]*Camera `json:"-" yaml:"-"`
	HeadMap   map[string]*Head   `json:"-" yaml:"-"`
}
type Translate struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func (h *Head) GlobalPos() geom.Vec {
	t2 := h.Stand
	t1 := t2.M
	t3 := h.M
	t0 := t1.Mul(t3)
	return t0.Translation()
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

	config.MustGetYAML(consulClient, "/the-heads/scene.yaml", scene)

	// heads and cameras don't "exist" until they are added to a stand
	definedHeads := map[string]*Head{}
	definedCameras := map[string]*Camera{}

	// CameraMap
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
		definedCameras[camera.Name] = camera
	}

	// HeadMap
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
		definedHeads[head.Name] = head
	}

	// Stands
	standYAML, err := config.GetPrefix(consulClient, "/the-heads/stands")
	if err != nil {
		return nil, err
	}

	for _, yml := range standYAML {
		stand := &Stand{
			Enabled:   true,
			CameraMap: map[string]*Camera{},
			HeadMap:   map[string]*Head{},
		}
		err := yaml.Unmarshal(yml, &stand)
		if err != nil {
			return nil, err
		}

		if stand.Disabled || !stand.Enabled {
			continue
		}

		stand.M = geom.ToM(stand.Pos.X, stand.Pos.Y, stand.Rot)

		for _, name := range stand.CameraNames {
			camera, ok := definedCameras[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			camera.Stand = stand
			stand.CameraMap[camera.Name] = camera
			stand.Cameras = append(stand.Cameras, camera)
			scene.Cameras[camera.Name] = camera
		}

		for _, name := range stand.HeadNames {
			head, ok := definedHeads[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			head.Stand = stand
			head.MInv = head.Stand.M.Mul(head.M).Inv() // hmmmm, we use Stand.M for MInv but not for head.M
			stand.HeadMap[head.Name] = head
			stand.Heads = append(stand.Heads, head)
			scene.Heads[head.Name] = head
		}

		scene.Stands = append(scene.Stands, stand)
	}

	fmt.Println(scene)

	return scene, nil
}

package scene

import (
	"fmt"
	geom2 "github.com/cacktopus/theheads/common/geom"
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/timed_reset"
	"github.com/pkg/errors"
	"io/ioutil"
	"math"
	"math/rand"
	"path"
	"strings"
	"time"

	"gopkg.in/yaml.v2"
)

const (
	defaultCameraSensitivity = 0.2
)

type Scene struct {
	Stands        []*Stand  `json:"stands"`
	Scale         int       `json:"scale"`
	Anchors       []*Anchor `json:"anchors"`
	Translate     Translate `json:"translate"`
	Scenes        []string  `json:"scenes"`
	StartupScenes []string  `json:"startup_scenes" yaml:"startup_scenes"`

	Heads    map[string]*Head `json:"-"`
	HeadList []*Head          `json:"-"`

	Cameras    map[string]*Camera `json:"-" yaml:"-"`
	CameraList []*Camera          `json:"-" yaml:"-"`

	// TODO: don't hang these config values off of here
	CameraSensitivity float64 `json:"camera_sensitivity" yaml:"camera_sensitivity"`

	Texts []*Text
}

type Pos struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type Camera struct {
	Description string    `json:"description"`
	Fov         float64   `json:"fov"`
	Name        string    `json:"name"`
	Pos         Pos       `json:"pos"`
	Rot         float64   `json:"rot"`
	M           geom2.Mat `json:"-"`
	Stand       *Stand    `json:"-"`
	Path        []string  `json:"-"`
}

func (c Camera) URI() string {
	return fmt.Sprintf("camera://%s/%s", strings.Join(c.Path, "/"), c.Name)
}

type Head struct {
	Name    string    `json:"name"`
	Path    []string  `json:"-"`
	Pos     Pos       `json:"pos"`
	Rot     float64   `json:"rot"`
	Virtual bool      `json:"virtual"`
	M       geom2.Mat `json:"-"`
	MInv    geom2.Mat `json:"-"`
	Stand   *Stand    `json:"-"`

	fearful *timed_reset.Bool
}

func (h *Head) URI() string {
	return fmt.Sprintf("head://%s/%s", strings.Join(h.Path, "/"), h.Name)
}

func (h *Head) LedsURI() string {
	return fmt.Sprintf("leds://%s/%s", strings.Join(h.Path, "/"), h.Name)
}

func (h *Head) CameraURI() string {
	return fmt.Sprintf(
		"camera://%s/%s",
		strings.Join(h.Path, "/"),
		strings.Replace(h.Name, "head", "camera", -1), // TODO: should actually traverse entity tree
	)
}

func (h *Head) Fearful() bool {
	return h.fearful.Val()
}

type Anchor struct {
	Name    string `json:"name"`
	Pos     Pos    `json:"pos"`
	Enabled bool
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

func ShuffledHeads(heads map[string]*Head) (result []*Head) {
	for _, head := range heads {
		result = append(result, head)
	}
	rand.Shuffle(len(result), func(i, j int) {
		result[i], result[j] = result[j], result[i]
	})
	return
}

func (s *Scene) HeadURIs() []string {
	var result []string
	for _, head := range s.HeadList {
		result = append(result, head.URI())
	}
	return result
}

func (s *Scene) OnFaceDetected(msg *schema.FaceDetected) error {
	heads, err := s.findHeadsForCamera(msg.CameraName)
	if err != nil {
		return errors.Wrap(err, "find heads for camera")
	}
	for _, head := range heads {
		duration := time.Duration(20+rand.Intn(10)) * time.Second
		head.fearful.SetFor(duration)
	}
	return nil
}

func (s *Scene) findHeadsForCamera(name string) ([]*Head, error) {
	camera, ok := s.Cameras[name]
	if !ok {
		return nil, errors.New("unknown camera")
	}
	stand := camera.Stand
	if stand == nil {
		return nil, nil
	}
	return stand.Heads, nil
}

func (s *Scene) ClearFearful() {
	for _, head := range s.Heads {
		head.fearful.Clear()
	}
}

type Stand struct {
	CameraNames []string `json:"-" yaml:"cameras"`
	HeadNames   []string `json:"-" yaml:"heads"`

	Name string    `json:"name"`
	Pos  Pos       `json:"pos"`
	Rot  float64   `json:"rot"`
	M    geom2.Mat `json:"-"`

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

func (h *Head) GlobalPos() geom2.Vec {
	t2 := h.Stand
	t1 := t2.M
	t3 := h.M
	t0 := t1.Mul(t3)
	return t0.Translation()
}
func (h *Head) PointAwayFrom(p geom2.Vec) float64 {
	return math.Mod(h.PointTo(p)+180.0+360.0, 360.0)
}

func (h *Head) PointTo(p geom2.Vec) float64 {
	to := h.MInv.MulVec(p)
	theta := math.Atan2(to.Y(), to.X()) * 180 / math.Pi
	return math.Mod(theta+360.0, 360)
}

func mustGetYAML(path string, result interface{}) {
	content, err := ioutil.ReadFile(path)

	if err != nil {
		panic(errors.Wrap(err, path+" not found"))
	}

	err = yaml.Unmarshal(content, result)
	if err != nil {
		panic(err)
	}
}

func getPrefix(prefix string) (map[string][]byte, error) {
	dir, err := ioutil.ReadDir(prefix)
	if err != nil {
		return nil, errors.Wrap(err, "readdir "+prefix)
	}

	result := map[string][]byte{}
	for _, info := range dir {
		filename := path.Join(prefix, info.Name())

		ext := path.Ext(filename)
		if ext != ".yaml" && ext != ".yml" && ext != ".json" {
			continue
		}

		content, err := ioutil.ReadFile(filename)
		if err != nil {
			return nil, errors.Wrap(err, "readdir "+info.Name())
		}

		result[info.Name()] = content
	}

	return result, nil
}

func BuildInstallation(scenePath, sceneName, textSet string) (*Scene, error) {
	scene := &Scene{
		Cameras: map[string]*Camera{},
		Heads:   map[string]*Head{},
	}

	mustGetYAML(path.Join(scenePath, sceneName+".yaml"), scene)

	// heads and cameras don't "exist" until they are added to a stand
	definedHeads := map[string]*Head{}
	definedCameras := map[string]*Camera{}

	// CameraMap

	cameraYAML, err := getPrefix(path.Join(scenePath, "cameras"))
	if err != nil {
		return nil, err
	}

	for _, yml := range cameraYAML {
		camera := &Camera{}
		err := yaml.Unmarshal(yml, &camera)
		if err != nil {
			return nil, err
		}

		camera.M = geom2.ToM(camera.Pos.X, camera.Pos.Y, camera.Rot)
		definedCameras[camera.Name] = camera
	}

	// HeadMap
	headYAML, err := getPrefix(path.Join(scenePath, "heads"))
	if err != nil {
		return nil, err
	}
	for _, yml := range headYAML {
		head := &Head{
			fearful: timed_reset.NewBool(),
		}
		err := yaml.Unmarshal(yml, &head)
		if err != nil {
			return nil, err
		}

		head.M = geom2.ToM(head.Pos.X, head.Pos.Y, head.Rot)
		definedHeads[head.Name] = head
	}

	// Stands
	standYAML, err := getPrefix(path.Join(scenePath, "stands"))
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

		stand.M = geom2.ToM(stand.Pos.X, stand.Pos.Y, stand.Rot)

		for _, name := range stand.CameraNames {
			camera, ok := definedCameras[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			camera.Path = []string{stand.Name}
			camera.Stand = stand
			stand.CameraMap[camera.Name] = camera
			stand.Cameras = append(stand.Cameras, camera)
			scene.Cameras[camera.Name] = camera
			scene.CameraList = append(scene.CameraList, camera)
		}

		for _, name := range stand.HeadNames {
			head, ok := definedHeads[name]
			if !ok {
				return nil, errors.New(fmt.Sprintf("%s not found", name))
			}
			head.Path = []string{stand.Name}
			head.Stand = stand
			head.MInv = head.Stand.M.Mul(head.M).Inv() // hmmmm, we use Stand.M for MInv but not for head.M
			stand.HeadMap[head.Name] = head
			stand.Heads = append(stand.Heads, head)
			scene.Heads[head.Name] = head
			scene.HeadList = append(scene.HeadList, head)
		}

		scene.Stands = append(scene.Stands, stand)
	}

	// Anchors
	anchorYAML, err := getPrefix(path.Join(scenePath, "anchors"))
	if err != nil {
		return nil, err
	}
	for _, yml := range anchorYAML {
		anchor := &Anchor{}
		err := yaml.Unmarshal(yml, &anchor)
		if err != nil {
			return nil, err
		}

		scene.Anchors = append(scene.Anchors, anchor)
	}

	if scene.CameraSensitivity == 0 {
		scene.CameraSensitivity = defaultCameraSensitivity

	}

	// Texts
	scene.Texts = LoadTexts(scenePath, textSet)

	return scene, nil
}

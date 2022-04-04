package motor

import (
	"github.com/cacktopus/theheads/common/broker"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"math"
	"sync"
	"time"
)

type State struct {
	Pos       int
	Target    int
	Speed     int
	Steps     int
	ActorName string
}

func (s *State) TargetRotation() float64 {
	return float64(s.Target) / float64(s.Steps) * 360.0
}

func (s *State) Rotation() float64 {
	return float64(s.Pos) / float64(s.Steps) * 360.0
}

func (s *State) StepsAway() int {
	fwd := Mod(s.Target-s.Pos, s.Steps)
	bck := Mod(s.Pos-s.Target, s.Steps)

	if bck < fwd {
		return bck
	}
	return fwd
}

func (s *State) Eta() float64 {
	return float64(s.StepsAway()) / float64(s.Speed)
}

type Actor interface {
	Act(pos, target int) (direction Direction, done bool)
	Name() string
	Finish(controller *Controller)
}

func hasStep(steps []Direction, direction Direction) bool {
	for _, d := range steps {
		if d == direction {
			return true
		}
	}
	return false
}

type Cfg struct {
	MotorID               int `envconfig:"default=0"`
	NumSteps              int `envconfig:"default=200"`
	StepSpeed             int `envconfig:"default=30"`
	DirectionChangePauses int `envconfig:"default=10"`
}

type Controller struct {
	lock   sync.Mutex
	logger *zap.Logger

	motor  Motor
	Broker *broker.Broker

	numSteps int

	pos    int
	target int

	speed int // steps per second
	delay time.Duration

	prevSteps []Direction

	name string

	defaultActor Actor
	actor        Actor
}

func NewController(
	logger *zap.Logger,
	motor Motor,
	broker *broker.Broker,
	cfg *Cfg,
	name string,
	defaultActor Actor,
) *Controller {
	if cfg.StepSpeed == 0 {
		panic("speed can't be 0")
	}

	var prevSteps []Direction
	for i := 0; i < cfg.DirectionChangePauses; i++ {
		prevSteps = append(prevSteps, NoStep)
	}

	return &Controller{
		logger:   logger,
		motor:    motor,
		Broker:   broker,
		numSteps: cfg.NumSteps,
		speed:    cfg.StepSpeed,
		delay:    time.Duration(float64(time.Second) / float64(cfg.StepSpeed)),
		name:     name,

		prevSteps: prevSteps,

		defaultActor: defaultActor,
		actor:        defaultActor,
	}
}

func (s *Controller) Step(direction Direction) error {
	func() {
		s.lock.Lock()
		defer s.lock.Unlock()

		// prevent sudden back-and-forth changes
		oppsite := OppositeDirection(direction)
		if hasStep(s.prevSteps, oppsite) {
			direction = NoStep
		}

		s.prevSteps = append(s.prevSteps[1:], direction)
		s.pos += int(direction)
	}()

	err := s.motor.Step(direction)
	return errors.Wrap(err, "step")
}

func (s *Controller) getActor() Actor {
	s.lock.Lock()
	s.lock.Unlock()
	return s.actor
}

func (s *Controller) Speed() int {
	s.lock.Lock()
	defer s.lock.Unlock()

	return s.speed
}

func (s *Controller) SetTargetRotation(target float64) {
	s.lock.Lock()
	defer s.lock.Unlock()

	_, frac := math.Modf(target / 360.0)
	s.target = int(math.Round(frac * float64(s.numSteps)))
}

func (s *Controller) GetState() *State {
	s.lock.Lock()
	defer s.lock.Unlock()

	return s.state()
}

func (s *Controller) state() *State {
	return &State{
		Pos:       s.pos,
		Target:    s.target,
		Speed:     s.speed,
		Steps:     s.numSteps,
		ActorName: s.actor.Name(),
	}
}

func Mod(x, y int) int {
	result := x % y
	if result < 0 {
		return result + y
	}
	return result
}

func (s *Controller) Control() (direction Direction, done bool) {
	s.lock.Lock()
	pos, target := s.pos, s.target
	actor := s.actor
	s.lock.Unlock()

	return actor.Act(pos, target)
}

func (s *Controller) publish() {
	//msgType := "head-positioned"
	state := s.GetState()
	msg := &broker.HeadPositioned{
		HeadName:     s.name,
		StepPosition: float32(state.Steps),
		Rotation:     float32(state.Rotation()),
	}

	//MessageHeader: schema.MessageHeader{Type: msgType},
	//Data: schema.HeadPositionedData{
	//	HeadName:     s.name,
	//	StepPosition: pos,
	//	Rotation:     rot,
	//},

	s.Broker.Publish(msg)
}

func (s *Controller) Run() {
	delay := float64(time.Second) / float64(s.Speed())
	ticker := time.NewTicker(time.Duration(delay))

	for range ticker.C {
		step, done := s.Control()
		if done {
			s.getActor().Finish(s)
			s.SetActor(s.defaultActor)
		}
		err := s.Step(step)
		if err != nil {
			s.logger.Error("error stepping", zap.Error(err))
			continue
		}

		if step != NoStep {
			s.publish()
		}
	}
}

func (s *Controller) SetActor(actor Actor) {
	s.lock.Lock()
	defer s.lock.Unlock()
	s.actor = actor
}

func (s *Controller) SetCurrentPositionAsZero() {
	s.lock.Lock()
	defer s.lock.Unlock()

	s.pos = 0
	s.target = 0
}

func (s *Controller) TurnOffMotor() error {
	s.lock.Lock()
	defer s.lock.Unlock()

	err := s.motor.Off()
	return errors.Wrap(err, "motor off")
}

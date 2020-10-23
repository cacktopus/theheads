package motor

import (
	"github.com/cacktopus/theheads/common/schema"
	"github.com/cacktopus/theheads/common/redis_publisher"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"math"
	"sync"
	"time"
)

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

type Controller struct {
	lock   sync.Mutex
	logger *zap.Logger

	motor     Motor
	publisher *redis_publisher.RedisPublisher

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
	publisher *redis_publisher.RedisPublisher,
	numSteps, speed, directionChangePauses int,
	name string,
	defaultActor Actor,
) *Controller {
	if speed == 0 {
		panic("speed can't be 0")
	}

	var prevSteps []Direction
	for i := 0; i < directionChangePauses; i++ {
		prevSteps = append(prevSteps, NoStep)
	}

	return &Controller{
		logger:    logger,
		motor:     motor,
		publisher: publisher,
		numSteps:  numSteps,
		speed:     speed,
		delay:     time.Duration(float64(time.Second) / float64(speed)),
		name:      name,

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

func (s *Controller) ActorName() string {
	return s.getActor().Name()
}

func (s *Controller) Speed() int {
	s.lock.Lock()
	defer s.lock.Unlock()

	return s.speed
}

func (s *Controller) TargetRotation() float64 {
	s.lock.Lock()
	defer s.lock.Unlock()
	return float64(s.target) / float64(s.numSteps) * 360.0
}

func (s *Controller) SetTargetRotation(target float64) {
	s.lock.Lock()
	defer s.lock.Unlock()

	_, frac := math.Modf(target / 360.0)
	s.target = int(math.Round(frac * float64(s.numSteps)))
}

func (s *Controller) State() (int, float64) {
	s.lock.Lock()
	defer s.lock.Unlock()
	result := float64(s.pos) / float64(s.numSteps) * 360.0
	return s.pos, result
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
	msgType := "head-positioned"
	pos, rot := s.State()
	msg := &schema.HeadPositioned{
		MessageHeader: schema.MessageHeader{Type: msgType},
		Data: schema.HeadPositionedData{
			HeadName:     s.name,
			StepPosition: pos,
			Rotation:     rot,
		},
	}

	err := s.publisher.SendMsg(msg)
	if err != nil {
		s.logger.Error("error publishing", zap.String("type", msgType), zap.Error(err))
	}
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

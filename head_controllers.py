from enum import IntEnum

from head_util import NUM_STEPS
from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT


class Step(IntEnum):
    forward = 1
    backward = -1
    no_step = 0


class Controller:
    @property
    def step_type(self):
        return MotorHAT.DOUBLE

    def act(self, *args):
        raise NotImplementedError

    def is_done(self):
        raise NotImplementedError


class Seeker(Controller):
    def act(self, pos: int, target: int) -> Step:
        options = [
            ((target - pos) % NUM_STEPS, Step.forward),
            ((pos - target) % NUM_STEPS, Step.backward),
        ]

        steps, direction = min(options)

        if steps > 0:
            return direction

        return Step.no_step

    def is_done(self) -> bool:
        return False


class Idle(Controller):
    def act(self, *args) -> Step:
        return Step.no_step

    def is_done(self):
        return False


class SlowRotate(Controller):
    def __init__(self):
        self.gen = self.next_step()

    def next_step(self):
        while True:
            for i in range(20000):
                yield Step.forward

            for i in range(20000):
                yield Step.backward

    def act(self, *args) -> Step:
        step = next(self.gen, None)
        return step

    def is_done(self) -> bool:
        return False

    @property
    def step_type(self):
        return MotorHAT.MICROSTEP

from typing import Optional

from head_util import NUM_STEPS
from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT


class Controller:
    @property
    def step_type(self):
        return MotorHAT.DOUBLE

    def act(self, *args):
        raise NotImplementedError

    def is_done(self):
        raise NotImplementedError


class Seeker(Controller):
    def act(self, pos: int, target: int) -> Optional[int]:
        options = [
            ((target - pos) % NUM_STEPS, 1),
            ((pos - target) % NUM_STEPS, -1),
        ]

        steps, direction = min(options)

        if steps > 0:
            return direction

        return None

    def is_done(self) -> bool:
        return False


class Idle(Controller):
    def act(self, *args) -> Optional[int]:
        return None

    def is_done(self):
        return False


class SlowRotate(Controller):
    def act(self, *args) -> Optional[int]:
        return 1

    def is_done(self) -> bool:
        return False

    @property
    def step_type(self):
        return MotorHAT.MICROSTEP

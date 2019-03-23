import time
from collections import deque

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT

import motors


class ZeroNotFoundError(Exception):
    pass


class ZeroDetector:
    def __init__(self, motor):
        self.remaining_steps = 1000
        self._motor = motor

    def step_until(self, direction, target_value, count):
        values = deque(maxlen=count)

        while True:
            v = self.read_value()
            values.append(v)
            if len(values) == count and all(v == target_value for v in values):
                return True
            self.step(direction)

    def find_zero(self):
        pass

    def step(self, direction):
        self.remaining_steps -= 1
        if self.remaining_steps <= 0:
            raise ZeroNotFoundError

        self._motor.oneStep(direction, MotorHAT.DOUBLE)
        time.sleep(0.025)  # TODO: get value from elsewhere

    def read_value(self):
        raise NotImplementedError


def main():
    motor = motors.setup()
    zd = ZeroDetector(motor)
    zd.find_zero()
    pass


if __name__ == '__main__':
    main()

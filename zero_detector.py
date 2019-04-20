import os
from collections import deque
from typing import Optional

import motors

GPIO_PIN = 21
STEPS = 200

FORWARD = 1
BACKWARD = -1


class FakeGPIO:
    def __init__(self):
        pass

    def read_int(self) -> int:
        return 1


class GPIO:
    def __init__(self, pin=GPIO_PIN):
        self._pin = pin
        self._gpio_dir = "/sys/class/gpio"
        self._gpio_pin_dir = "/sys/class/gpio/gpio{}".format(self._pin)
        self._export = "/sys/class/gpio/export"
        self._direction = "/sys/class/gpio/gpio{}/direction".format(self._pin)
        self._value = "/sys/class/gpio/gpio{}/value".format(self._pin)

        if not os.path.exists(self._gpio_pin_dir):
            with open(self._export, "w") as f:
                print(GPIO_PIN, file=f)

        with open(self._direction, "w") as f:
            print("in", file=f)

    def read_int(self) -> int:
        with open(self._value) as f:
            v = f.read()

        return int(v)


class ZeroNotFoundError(Exception):
    pass


class ZeroDetector:
    def __init__(self, gpio: GPIO):
        self.remaining_steps = 1000
        # self._motor = motor
        self._gpio = gpio
        self.gen = self.find_zero()
        self._done = False

    def act(self, *args) -> Optional[int]:
        step = next(self.gen, None)
        if step is None:
            self._done = True
        return step

    def is_done(self) -> bool:
        return self._done

    def finish(self, stepper):
        stepper.zero()

    def step_until(self, direction, target_value, count):
        values = deque(maxlen=count)

        while True:
            v = self.read_value()
            print(v, self.remaining_steps)
            values.append(v)
            if len(values) == count and all(v == target_value for v in values):
                return
            yield from self.step(direction)

    def find_zero(self):
        yield from self.step_until(FORWARD, 1, 50)
        yield from self.step_until(BACKWARD, 1, 25)
        steps_to_zero = yield from self.scan()

        for i in range(steps_to_zero):
            yield from self.step(FORWARD)

    def scan(self):
        print("scan")
        values = deque(maxlen=STEPS)
        for i in range(STEPS):
            v = self.read_value()
            print(v)
            if v == 0:
                values.append(i)
            yield from self.step(FORWARD)

        if len(values) == 0:
            return 0

        zero_pos = sum(values) / len(values)
        steps = int(zero_pos)
        return steps

    def step(self, direction):
        self.remaining_steps -= 1
        if self.remaining_steps <= 0:
            raise ZeroNotFoundError

        yield direction

    def read_value(self) -> int:
        return self._gpio.read_int()


def main():
    gpio = GPIO(GPIO_PIN)
    motor = motors.setup()
    zd = ZeroDetector(gpio, motor)
    zd.find_zero()
    pass


if __name__ == '__main__':
    main()

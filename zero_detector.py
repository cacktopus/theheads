import os
import time
from collections import deque

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT

import motors

GPIO_PIN = 21
STEPS = 200


class GPIO:
    def __init__(self, pin):
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
    def __init__(self, gpio: GPIO, motor):
        self.remaining_steps = 1000
        self._motor = motor
        self._gpio = gpio

    def step_until(self, direction, target_value, count):
        values = deque(maxlen=count)

        while True:
            v = self.read_value()
            print(v, self.remaining_steps)
            values.append(v)
            if len(values) == count and all(v == target_value for v in values):
                return True
            self.step(direction)

    def find_zero(self):
        self.step_until(MotorHAT.FORWARD, 1, 50)
        self.step_until(MotorHAT.BACKWARD, 1, 25)
        steps_to_zero = self.scan()

        for i in range(steps_to_zero):
            self.step(MotorHAT.FORWARD)

    def scan(self):
        print("scan")
        values = deque(maxlen=STEPS)
        for i in range(STEPS):
            v = self.read_value()
            print(v)
            if v == 0:
                values.append(i)
            self.step(MotorHAT.FORWARD)

        zero_pos = sum(values) / len(values)
        steps = int(zero_pos)
        return steps

    def step(self, direction):
        self.remaining_steps -= 1
        if self.remaining_steps <= 0:
            raise ZeroNotFoundError

        self._motor.oneStep(direction, MotorHAT.DOUBLE)
        time.sleep(0.025)  # TODO: get value from elsewhere

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

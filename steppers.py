import sys
import time

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from bottle import run, template, Bottle, request

from motors import setup
from threading import Thread

app = Bottle()

NUM_STEPS = 200
DEFAULT_SPEED = 50
directions = {1: MotorHAT.FORWARD, -1: MotorHAT.BACKWARD}


class Stepper:
    def __init__(self):
        self._pos = 0
        self._target = 0
        self._motor = setup()
        self._speed = DEFAULT_SPEED

    def zero(self):
        self._pos = 0
        self._target = 0

    def set_target(self, target: int):
        self._target = target

    def set_speed(self, speed: float):
        self._speed = speed

    def seek(self):
        while True:
            options = [
                ((self._target - self._pos) % NUM_STEPS, 1),
                ((self._pos - self._target) % NUM_STEPS, -1),
            ]

            steps, direction = min(options)

            if steps > 0:
                self._pos += direction
                self._pos %= NUM_STEPS
                self._motor.oneStep(directions[direction], MotorHAT.DOUBLE)

            time.sleep(1.0 / self._speed)


stepper = Stepper()


@app.route('/position/<target>')
def index(target):
    target = int(target)
    speed = request.params.get("speed")
    speed = float(speed) if speed else None

    stepper.set_target(target)
    if speed is not None:
        stepper.set_speed(speed)

    return template('OK\n')


@app.route('/zero')
def index():
    stepper.zero()

    return template('OK\n')


def console_fun():
    stepper = setup()
    steps = int(sys.argv[1])

    direction = MotorHAT.FORWARD if steps >= 0 else MotorHAT.BACKWARD
    steps = abs(steps)

    while True:
        for i in range(steps):
            stepper.oneStep(MotorHAT.FORWARD, MotorHAT.DOUBLE)
            # stepper.oneStep(MotorHAT.BACKWARD, MotorHAT.SINGLE)
            time.sleep(0.01)

        for i in range(steps):
            stepper.oneStep(MotorHAT.BACKWARD, MotorHAT.DOUBLE)
            # stepper.oneStep(MotorHAT.BACKWARD, MotorHAT.SINGLE)
            time.sleep(0.01)


def main():
    t = Thread(target=stepper.seek, daemon=True)
    t.start()

    run(app, host='0.0.0.0', port=8080, reloader=True)


if __name__ == '__main__':
    main()

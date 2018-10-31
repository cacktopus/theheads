import sys
import time

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from bottle import run, template, Bottle

from motors import setup

app = Bottle()
stepper = setup()
pos = 0

NUM_STEPS = 200


@app.route('/forward/<steps>')
def index(steps):
    global pos
    steps = int(steps)
    for i in range(steps):
        pos += 1
        stepper.oneStep(MotorHAT.FORWARD, MotorHAT.DOUBLE)
    return template('Hello {{steps}}', steps=steps)


@app.route('/position/<target>')
def index(target):
    global pos
    target = int(target) % NUM_STEPS
    delta = (target - pos) % NUM_STEPS

    for i in range(delta):
        pos += 1
        stepper.oneStep(MotorHAT.FORWARD, MotorHAT.DOUBLE)
    return template('at {{pos}}', pos=pos)


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
    run(app, host='0.0.0.0', port=8080)


if __name__ == '__main__':
    main()

import sys
import time

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from bottle import run, template, Bottle

from motors import setup

app = Bottle()
stepper = setup()


@app.route('/forward/<steps>')
def index(steps):
    steps = int(steps)
    for i in range(steps):
        stepper.oneStep(MotorHAT.FORWARD, MotorHAT.DOUBLE)
    return template('Hello {{steps}}', steps=steps)


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

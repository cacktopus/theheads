import atexit
import sys
import time

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT


def main():
    mh = MotorHAT()

    # recommended for auto-disabling motors on shutdown!
    def turn_off_motors():
        mh.getMotor(1).run(MotorHAT.RELEASE)
        mh.getMotor(2).run(MotorHAT.RELEASE)
        mh.getMotor(3).run(MotorHAT.RELEASE)
        mh.getMotor(4).run(MotorHAT.RELEASE)

    atexit.register(turn_off_motors)

    stepper = mh.getStepper(200, 1)
    # stepper.setSpeed(30)

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


if __name__ == '__main__':
    main()

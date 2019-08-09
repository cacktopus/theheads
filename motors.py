import atexit
import platform

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT


def _setup(motor_num: int = 1):
    mh = MotorHAT()

    # recommended for auto-disabling motors on shutdown!
    def turn_off_motors():
        mh.getMotor(1).run(MotorHAT.RELEASE)
        mh.getMotor(2).run(MotorHAT.RELEASE)
        mh.getMotor(3).run(MotorHAT.RELEASE)
        mh.getMotor(4).run(MotorHAT.RELEASE)

    atexit.register(turn_off_motors)

    stepper = mh.getStepper(200, motor_num)
    # stepper.setSpeed(30)

    return stepper


class FakeStepper:
    def __init__(self, motor_num: int = 1):
        pass

    def oneStep(self, *args):
        pass


setup = _setup if platform.machine().startswith("arm") else FakeStepper

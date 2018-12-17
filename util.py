import os

MODEL = "/sys/firmware/devicetree/base/model"


def is_rpi3():
    if os.path.exists(MODEL):
        with open(MODEL) as fp:
            return "Raspberry Pi 3" in fp.read()

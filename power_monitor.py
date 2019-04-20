#!/usr/bin/env python
import json

from ina219 import INA219
from ina219 import DeviceRangeError
import time

SHUNT_OHMS = 0.1


def read(*addrs):
    inas = [
        (INA219(SHUNT_OHMS, address=addr), addr)
        for addr in addrs
    ]

    for ina, _ in inas:
        ina.configure()

    for ina, addr in inas:
        data = dict(
            voltage=ina.voltage(),
            current=ina.current(),
            power=ina.power(),
            shunt_voltage=ina.shunt_voltage(),
            t=time.time(),
            addr=hex(addr),
        )

        print(json.dumps(data))

        # print("Bus Voltage: %.3f V" % ina.voltage())
        # try:
        #     print("Bus Current: %.3f mA" % ina.current())
        #     print("Power: %.3f mW" % ina.power())
        #     print("Shunt voltage: %.3f mV" % ina.shunt_voltage())
        # except DeviceRangeError as e:
        #     # Current out of device range with specified shunt resistor
        #     print(e)


def main():
    while True:
        read(0x40, 0x41)
        time.sleep(1)


if __name__ == "__main__":
    main()

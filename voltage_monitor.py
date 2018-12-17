import asyncio
import math
import os
from collections import deque
from typing import Callable

ROOT = "/sys/class/gpio"
DELAY = 1 / 25
ACCUMULATION_WINDOW = 60  # s


async def monitor_voltage(callback: Callable):
    gpio = os.path.join(ROOT, "gpio35")
    if not os.path.exists(gpio):
        with open(os.path.join(ROOT, "export"), "wb") as fp:
            fp.write(b"35")
    assert os.path.exists(gpio)

    with open(os.path.join(gpio, "direction"), "rb") as fp:
        assert fp.read().strip() == b"in"

    size = int(math.ceil(ACCUMULATION_WINDOW / DELAY))
    values = deque(maxlen=size)

    while True:
        with open(os.path.join(gpio, "value"), "rb") as fp:
            contents = fp.read()
        value = int(contents.decode())

        values.append(value)
        low_voltage_detected = any(x != 1 for x in values)
        callback(low_voltage_detected)

        await asyncio.sleep(DELAY)


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(monitor_voltage(lambda x: print(x)))


if __name__ == '__main__':
    main()

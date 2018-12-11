import asyncio
import json
import sys
import time

from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from aiohttp import web

from etcd_config import EtcdConfig
from motors import setup
from rpc_util import d64

STEPPERS_PORT = 8080
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

    async def seek(self):
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

            await asyncio.sleep(1.0 / self._speed)


stepper = Stepper()


def position(request):
    target = int(request.match_info.get('target'))
    speed = request.query.get("speed")
    speed = float(speed) if speed else None

    stepper.set_target(target)
    if speed is not None:
        stepper.set_speed(speed)

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json")


async def zero(request):
    stepper.zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json")


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


async def get_config(endpoint: str):
    cfg = await EtcdConfig(endpoint).setup()

    kv = await cfg.get_prefix("/the-heads/installation/{installation}/redis/")

    redis_servers = []
    for a in kv:
        rs = d64(a['value']).decode().strip()
        redis_servers.append(rs)

    print("Found {} redis servers".format(len(redis_servers)))
    assert len(redis_servers) > 0

    return dict(
        endpoint=endpoint,
        installation=cfg.installation,
        redis_servers=redis_servers,
    )



def main():
    app = web.Application()

    loop = asyncio.get_event_loop()

    cfg = loop.run_until_complete(get_config())

    app.add_routes([
        web.get("/position/{target}", position),
        web.get("/zero", zero),
    ])

    asyncio.ensure_future(stepper.seek(), loop=loop)

    web.run_app(app, port=STEPPERS_PORT)


if __name__ == '__main__':
    main()

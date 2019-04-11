import argparse
import asyncio
import json
import platform
from typing import Optional

import asyncio_redis
from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from aiohttp import web

import motors
from config import THE_HEADS_EVENTS, Config
from consul_config import ConsulBackend, ConfigError
from health import health_check
from util import run_app

STEPPERS_PORT = 8080
NUM_STEPS = 200
DEFAULT_SPEED = 50
directions = {1: MotorHAT.FORWARD, -1: MotorHAT.BACKWARD}
_DEFAULT_REDIS = "127.0.0.1:6379"


class Stepper:
    def __init__(self, cfg, redis: asyncio_redis.Connection, motor):
        self._pos = 0
        self._target = 0
        self._motor = motor
        self._speed = DEFAULT_SPEED
        self.queue = asyncio.Queue()
        self.cfg = cfg
        self.redis = redis

    @property
    def pos(self) -> int:
        return self._pos

    def zero(self):
        self._pos = 0
        self._target = 0

    def set_target(self, target: int):
        self._target = target

    def set_speed(self, speed: float):
        self._speed = speed

    def current_rotation(self) -> float:
        return self._pos / NUM_STEPS * 360.0

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
                self.queue.put_nowait(self._pos)
                self._motor.oneStep(directions[direction], MotorHAT.DOUBLE)

            await asyncio.sleep(1.0 / self._speed)

    async def redis_publisher(self):
        while True:
            pos = await self.queue.get()
            msg = {
                "type": "head-positioned",
                "data": {
                    "headName": self.cfg['head']['name'],
                    "stepPosition": pos,
                    "rotation": self.current_rotation(),
                }
            }
            try:
                await self.redis.publish(THE_HEADS_EVENTS, json.dumps(msg))
            except asyncio_redis.NotConnectedError:
                print("Not connected")


def adjust_position(request, speed, target):
    speed = float(speed) if speed else None
    stepper = request.app['stepper']
    stepper.set_target(target)
    if speed is not None:
        stepper.set_speed(speed)
    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json")


def position(request):
    target = int(request.match_info.get('target'))
    speed = request.query.get("speed")

    return adjust_position(request, speed, target)


def rotation(request):
    theta = float(request.match_info.get('theta'))
    speed = request.query.get("speed")

    target = int(round(theta / 360.0 * NUM_STEPS))

    return adjust_position(request, speed, target)


async def zero(request):
    stepper = request.app['stepper']
    stepper.zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json")


async def get_config(config_endpoint: str, instance: str, port: int):
    consul_backend = ConsulBackend(config_endpoint)

    cfg = await Config(consul_backend).setup(instance)

    assert port is not None

    head_cfg = await cfg.get_config_yaml("/the-heads/heads/{instance}.yaml")

    redis_server = _DEFAULT_REDIS  # TODO

    result = dict(
        condig_endpoint=config_endpoint,
        redis_server=redis_server,
        instance=instance,
        port=port,
        head=head_cfg,
    )

    return result


async def publish_active(app):
    redis = app['redis']
    cfg = app['cfg']
    stepper = app['stepper']

    def data():
        return {
            "component": "head",
            "name": cfg['head']['name'],
            "extra": {
                "headName": cfg['head']['name'],
                "stepPosition": stepper.pos,
                "rotation": stepper.current_rotation(),
            }
        }

    await redis.publish(THE_HEADS_EVENTS, json.dumps({
        "type": "startup",
        "data": data(),
    }))

    while True:
        await asyncio.sleep(5)
        try:
            await redis.publish(THE_HEADS_EVENTS, json.dumps({
                "type": "active",
                "data": data(),
            }))
        except asyncio_redis.NotConnectedError:
            print("Not connected")


async def setup(
        instance: str,
        config_endpoint: Optional[str] = None,
        port_override: Optional[int] = None
):
    config_endpoint = config_endpoint or "http://127.0.0.1:8500"
    cfg = await get_config(config_endpoint, instance, port_override)

    redis_host, redis_port_str = cfg['redis_server'].split(":")
    redis_port = int(redis_port_str)

    print("connecting to redis: {}:{}".format(redis_host, redis_port))
    redis_connection = await asyncio_redis.Connection.create(host=redis_host, port=redis_port)
    print("connected to redis: {}:{}".format(redis_host, redis_port))

    if cfg['head'].get('virtual', False):
        motor = motors.FakeStepper()
    else:
        motor = motors.setup()

    stepper = Stepper(cfg, redis_connection, motor)
    asyncio.ensure_future(stepper.redis_publisher())
    asyncio.ensure_future(stepper.seek())

    app = web.Application()
    app['cfg'] = cfg
    app['stepper'] = stepper
    app['redis'] = redis_connection

    app.add_routes([
        web.get("/", home),
        web.get('/health', health_check),
        web.get("/position/{target}", position),
        web.get("/rotation/{theta}", rotation),
        web.get("/zero", zero),
    ])

    asyncio.ensure_future(publish_active(app))

    return app


async def home(request):
    cfg = request.app['cfg']
    stepper = request.app['stepper']

    lines = [
        'This is head "{}"'.format(cfg['head']['name']),
        'Position is {}'.format(stepper.pos),
    ]

    if cfg['head'].get('virtual', False):
        lines.append("This is a virtual head")

    return web.Response(text="\n".join(lines))


def main():
    parser = argparse.ArgumentParser(description='Process some integers.')

    parser.add_argument('--instance', type=str,
                        help='Instance name override for this head')

    parser.add_argument('--port', type=int, default=None,
                        help='Port override')

    parser.add_argument('--endpoint', type=str, default="http://127.0.0.1:8500",
                        help='Config service endpoint')

    args = parser.parse_args()

    loop = asyncio.get_event_loop()

    app = loop.run_until_complete(setup(
        instance=args.instance,
        config_endpoint=args.endpoint,
        port_override=args.port or 8080,
    ))

    loop.run_until_complete(run_app(app))
    loop.run_forever()
    # web.run_app(app, port=cfg['port'])


if __name__ == '__main__':
    main()

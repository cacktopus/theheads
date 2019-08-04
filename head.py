import argparse
import asyncio
import json
from typing import Optional

import asyncio_redis
from Adafruit_MotorHAT import Adafruit_MotorHAT as MotorHAT
from aiohttp import web

import log
import motors
import util
import zero_detector
from config import THE_HEADS_EVENTS, Config
from consul_config import ConsulBackend
from head_controllers import Seeker, Idle, SlowRotate
from head_util import NUM_STEPS
from health import health_check, CORS_ALL
from metrics import handle_metrics
from util import run_app

STEPPERS_PORT = 8080
DEFAULT_SPEED = 50
directions = {1: MotorHAT.FORWARD, -1: MotorHAT.BACKWARD}
_DEFAULT_REDIS = "127.0.0.1:6379"


class Stepper:
    def __init__(
            self,
            cfg,
            redis: asyncio_redis.Connection,
            motor,
            controller,
            next_controller,
            gpio,
    ):
        self._pos = 0
        self._target = 0
        self._motor = motor
        self._speed = DEFAULT_SPEED
        self.queue = asyncio.Queue()
        self.cfg = cfg
        self.redis = redis
        self._controller = controller
        self._next_controller = next_controller
        self._gpio = gpio

        # step to engage motor
        self._motor.oneStep(MotorHAT.FORWARD, MotorHAT.DOUBLE)
        self._motor.oneStep(MotorHAT.BACKWARD, MotorHAT.DOUBLE)

    @property
    def pos(self) -> int:
        return self._pos

    def set_current_position_as_zero(self):
        self._pos = 0
        self._target = 0

    def set_target(self, target: int):
        self._target = target

    def set_speed(self, speed: float):
        self._speed = speed

    def current_rotation(self) -> float:
        return self._pos / NUM_STEPS * 360.0

    def find_zero(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = zero_detector.ZeroDetector(self._gpio)

    def slow_rotate(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = SlowRotate()

    def seek(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = Seeker()

    async def run(self):
        while True:
            await asyncio.sleep(1.0 / self._speed)

            direction = self._controller.act(self._pos, self._target)
            if direction in (1, -1):
                self._pos += direction
                self._pos %= NUM_STEPS
                self._motor.oneStep(directions[direction], MotorHAT.DOUBLE)
                self.queue.put_nowait(self._pos)

            if self._controller.is_done():
                self._controller.finish(self)
                self._controller = self._next_controller or Idle()
                await self.publish("active")

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
                # TODO: stats
                log.error("Not connected")

    def publishing_data(self):
        return {
            "component": "head",
            "name": self.cfg['head']['name'],
            "extra": {
                "headName": self.cfg['head']['name'],
                "stepPosition": self.pos,
                "rotation": self.current_rotation(),
            }
        }

    async def publish(self, msg_type):
        try:
            await self.redis.publish(THE_HEADS_EVENTS, json.dumps({
                "type": msg_type,
                "data": self.publishing_data(),
            }))
        except asyncio_redis.NotConnectedError:
            # TODO: emit stats
            log.error("Not connected")

    async def publish_active_loop(self):
        await self.publish("startup")
        while True:
            await asyncio.sleep(5)
            await self.publish("active")


def adjust_position(request, speed, target):
    speed = float(speed) if speed else None
    stepper = request.app['stepper']
    stepper.set_target(target)
    if speed is not None:
        stepper.set_speed(speed)
    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


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
    stepper.set_current_position_as_zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def find_zero(request):
    stepper = request.app['stepper']
    stepper.find_zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def slow_rotate(request):
    stepper = request.app['stepper']
    stepper.slow_rotate()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def seek(request):
    stepper = request.app['stepper']
    stepper.seek()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


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


async def setup(
        instance: str,
        config_endpoint: Optional[str] = None,
        port_override: Optional[int] = None
):
    config_endpoint = config_endpoint or "http://127.0.0.1:8500"
    cfg = await get_config(config_endpoint, instance, port_override)

    redis_host, redis_port_str = cfg['redis_server'].split(":")
    redis_port = int(redis_port_str)

    log.info("connecting to redis", host=redis_host, port=redis_port)
    redis_connection = await asyncio_redis.Connection.create(host=redis_host, port=redis_port)
    log.info("connected to redis", host=redis_host, port=redis_port)

    if cfg['head'].get('virtual', False):
        motor = motors.FakeStepper()
        gpio = zero_detector.FakeGPIO()
    else:
        motor = motors.setup()
        gpio = zero_detector.GPIO()

    stepper = Stepper(
        cfg,
        redis_connection,
        motor,
        Seeker(),
        Seeker(),
        gpio,
    )
    util.create_task(stepper.redis_publisher())
    util.create_task(stepper.run())

    app = web.Application()
    app['cfg'] = cfg
    app['stepper'] = stepper
    app['redis'] = redis_connection

    app.add_routes([
        web.get("/", home),
        web.get('/health', health_check),
        web.get('/metrics', handle_metrics),
        web.get("/position/{target}", position),
        web.get("/rotation/{theta}", rotation),
        web.get("/zero", zero),
        web.get("/find_zero", find_zero),
        web.get("/slow_rotate", slow_rotate),
        web.get("/seek", seek),
    ])

    util.create_task(stepper.publish_active_loop())

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

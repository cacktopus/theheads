import argparse
import asyncio
import json
import os
from collections import deque
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
from head_controllers import Seeker, Idle, SlowRotate, Step
from head_util import NUM_STEPS, DIRECTION_CHANGE_PAUSES
from health import health_check, CORS_ALL
from metrics import handle_metrics
from util import run_app

STEPPERS_PORT = 8080
DEFAULT_SPEED = 50
directions = {Step.forward: MotorHAT.FORWARD, Step.backward: MotorHAT.BACKWARD}
_DEFAULT_REDIS = "127.0.0.1:6379"


def opposite_direction(direction: Step) -> Step:
    return {
        Step.forward: Step.backward,
        Step.backward: Step.forward,
        Step.no_step: Step.no_step,
    }[direction]


class Stepper:
    def __init__(
            self,
            cfg,
            redis: asyncio_redis.Connection,
            motor,
            controller,
            next_controller,
            gpio,
            publish: bool,
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
        self._previous_steps = deque(maxlen=DIRECTION_CHANGE_PAUSES)
        self._publish = publish

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

    def controller_name(self) -> str:
        return self._controller.__class__.__name__

    def find_zero(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = zero_detector.ZeroDetector(self._gpio)

    def slow_rotate(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = SlowRotate()

    def seek(self):
        self._next_controller = Seeker()  # TODO: derive from current controllers
        self._controller = Seeker()

    def steps_away(self) -> int:
        return min(
            (self._target - self._pos) % NUM_STEPS,
            (self._pos - self._target) % NUM_STEPS,
        )

    def eta(self) -> float:
        return self.steps_away() * (1.0 / self._speed)

    def off(self):
        self._motor.MC.setPin(self._motor.AIN2, 0)
        self._motor.MC.setPin(self._motor.BIN1, 0)
        self._motor.MC.setPin(self._motor.AIN1, 0)
        self._motor.MC.setPin(self._motor.BIN2, 0)

        self._next_controller = Idle()
        self._controller = Idle()

    async def run(self):
        while True:
            await asyncio.sleep(1.0 / self._speed)

            direction = self._controller.act(self._pos, self._target)

            if self._controller.is_done():
                self._controller.finish(self)
                self._controller = self._next_controller or Idle()
                continue

            # make sure head doesn't change directions too quickly
            oppsoite = opposite_direction(direction)
            if oppsoite in self._previous_steps and oppsoite in (Step.forward, Step.backward):
                direction = Step.no_step

            self._previous_steps.append(direction)

            if direction in (Step.forward, Step.backward):
                self._pos += direction
                self._pos %= NUM_STEPS
                self._motor.oneStep(directions[direction], self._controller.step_type)
                self.queue.put_nowait(self._pos)

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
        if not self._publish:
            return

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


def get_stepper(request) -> Stepper:
    sid = int(request.query.get("id", 1))
    stepper = request.app['steppers'][sid]
    return stepper


def adjust_position(request, speed, target):
    speed = float(speed) if speed else None
    stepper = get_stepper(request)
    stepper.set_target(target)
    if speed is not None:
        stepper.set_speed(speed)

    result = json.dumps({
        "result": "ok",
        "steps_away": stepper.steps_away(),
        "eta": stepper.eta(),

    })
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
    stepper = get_stepper(request)
    stepper.set_current_position_as_zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def find_zero(request):
    stepper = get_stepper(request)
    stepper.find_zero()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def slow_rotate(request):
    stepper = get_stepper(request)
    stepper.slow_rotate()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def seek(request):
    stepper = get_stepper(request)
    stepper.seek()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def off(request):
    stepper = get_stepper(request)
    stepper.off()

    result = json.dumps({"result": "ok"})
    return web.Response(text=result + "\n", content_type="application/json", headers=CORS_ALL)


async def status(request):
    stepper = get_stepper(request)

    return web.Response(text=json.dumps({
        "result": "ok",
        "position": stepper.pos,
        "rotation": stepper.current_rotation(),
        "controller": stepper.controller_name(),
        "steps_away": stepper.steps_away(),
        "eta": stepper.eta(),
    }), content_type="application/json", headers=CORS_ALL)


async def get_config(config_endpoint: str, instance: str, port: int):
    consul_backend = ConsulBackend(config_endpoint)

    cfg = await Config(consul_backend).setup(instance)

    assert port is not None

    head_cfg = await cfg.get_config_yaml("/the-heads/heads/{instance}.yaml")

    redis_server = os.environ.get("REDIS_ADDR", _DEFAULT_REDIS)  # TODO

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

    motor_data = [
        {"id": 1, "publish": True},
        {"id": 2, "publish": False},
    ]

    steppers = {}

    for m in motor_data:
        if cfg['head'].get('virtual', False):
            motor = motors.FakeStepper(m['id'])
            gpio = zero_detector.FakeGPIO()
        else:
            motor = motors.setup(m['id'])
            gpio = zero_detector.GPIO()

        stepper = Stepper(
            cfg,
            redis_connection,
            motor,
            Seeker(),
            Seeker(),
            gpio,
            publish=m['publish'],
        )
        util.create_task(stepper.redis_publisher())
        util.create_task(stepper.run())

        steppers[m['id']] = stepper

        util.create_task(stepper.publish_active_loop())

    app = web.Application()
    app['cfg'] = cfg
    app['steppers'] = steppers
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
        web.get("/off", off),
        web.get("/status", status),
    ])

    return app


async def home(request):
    cfg = request.app['cfg']
    sid = int(request.query.get("id", "1"))
    stepper = request.app['steppers'][sid]

    lines = [
        'This is head "{}"'.format(cfg['head']['name']),
        'Position is {}'.format(stepper.pos),
    ]

    if cfg['head'].get('virtual', False):
        lines.append("This is a virtual head")

    return web.Response(text="\n".join(lines))


def main():
    parser = argparse.ArgumentParser(description='Process some integers.')

    parser.add_argument('--port', type=int, default=None,
                        help='Port override')

    parser.add_argument('--endpoint', type=str, default="http://127.0.0.1:8500",
                        help='Config service endpoint')

    instance = os.environ.get("INSTANCE")

    if not instance:
        raise RuntimeError("Must set INSTANCE environment variable")

    args = parser.parse_args()

    loop = asyncio.get_event_loop()

    consul_addr = "http://" + os.environ.get("CONSUL_ADDR", "127.0.0.1:8500")

    app = loop.run_until_complete(setup(
        instance=instance,
        config_endpoint=consul_addr,
        port_override=args.port or 8080,
    ))

    loop.run_until_complete(run_app(app))
    loop.run_forever()
    # web.run_app(app, port=cfg['port'])


if __name__ == '__main__':
    main()

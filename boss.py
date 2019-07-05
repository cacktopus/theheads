import asyncio
import json
from typing import Optional

import asyncio_redis
import prometheus_client
from aiohttp import web

import boss_routes
import text_manager
import util
import ws
from config import THE_HEADS_EVENTS, get_args, Config
from consul_config import ConsulBackend
from focal_point_manager import FocalPointManager
from grid import Grid
from head_manager import HeadManager
from installation import build_installation, Installation
from observer import Observer
from orchestrator import Orchestrator

REDIS_MESSAGE_RECEIVED = prometheus_client.Counter(
    "heads_boss_redis_message_ingested",
    "Message ingested from redis",
    ["channel", "type", "src"],
)

TASKS = prometheus_client.Gauge(
    "heads_boss_tasks",
    "Number of asyncio tasks",
    [],
)

TASKS.set_function(lambda: len(asyncio.Task.all_tasks()))


async def run_redis(redis_hostport, broadcast):
    print("Connecting to redis:", redis_hostport)
    host, port = redis_hostport.split(":")
    connection = await asyncio_redis.Connection.create(host=host, port=int(port))
    print("Connected to redis", redis_hostport)
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe([THE_HEADS_EVENTS])

    while True:
        reply = await subscriber.next_published()
        msg = json.loads(reply.value)

        data = msg['data']
        src = data.get('cameraName') or data.get('headName') or data['name']

        REDIS_MESSAGE_RECEIVED.labels(
            reply.channel,
            msg['type'],
            src,
        ).inc()

        if msg['type'] == "motion-detected":
            broadcast("motion-detected", camera_name=data["cameraName"], position=data["position"])

        if msg['type'] in ("head-positioned", "active", "kinect"):
            # print(datetime.datetime.now(), host, msg['type'])
            broadcast(msg['type'], msg=msg)


async def get_config(
        port: int,
        config_endpoint: str,
):
    endpoint = ConsulBackend(config_endpoint)
    cfg = await Config(endpoint).setup(
        instance_name="boss-01",
    )

    resp, text = await endpoint.get_nodes_for_service("redis")
    assert resp.status == 200
    msg = json.loads(text)

    redis_servers = ["{}:{}".format(r['Address'], r['ServicePort']) for r in msg]

    assert len(redis_servers) > 0, "Need at least one redis server, for now"

    result = dict(
        endpoint=config_endpoint,
        redis_servers=redis_servers,
        cfg=cfg,
        port=port,
    )

    return result


async def setup(
        port: int,
        config_endpoint: Optional[str] = "http://127.0.0.1:8500",
):
    cfg = await get_config(port, config_endpoint)

    app = web.Application()
    app['cfg'] = cfg

    observer = Observer()
    app['observer'] = observer

    ws_manager = ws.WebsocketManager(broadcast=observer.notify_observers)

    json_inst = await build_installation(cfg['cfg'])
    inst = Installation.unmarshal(json_inst)

    app['inst'] = inst
    hm = HeadManager()

    app['head_manager'] = hm

    app['grid'] = Grid(-2, -4, 4, 2, (200, 200), installation=inst)  # TODO: not global!
    asyncio.ensure_future(app['grid'].decay())

    boss_routes.setup_routes(app, ws_manager)

    orchestrator = Orchestrator(
        inst=inst,
        head_manager=hm,
        broadcast=observer.notify_observers,
    )

    fp_manager = FocalPointManager(
        broadcast=observer.notify_observers,
        inst=inst,
        grid=app['grid'],
    )

    observer.register_observer(orchestrator)
    observer.register_observer(fp_manager)  # perhaps not the best place
    observer.register_observer(ws_manager)

    tm = text_manager.text_manager(
        head_manager=hm,
        broadcast=observer.notify_observers,
    )
    asyncio.create_task(tm)

    for redis in cfg['redis_servers']:
        asyncio.ensure_future(run_redis(redis, broadcast=observer.notify_observers))

    asyncio.create_task(app['grid'].publish_loop())

    return app


def main():
    args = get_args()

    loop = asyncio.get_event_loop()

    app = loop.run_until_complete(setup(
        config_endpoint=args.config_endpoint,
        port=args.port,
    ))

    loop.run_until_complete(util.run_app(app))
    loop.run_forever()


if __name__ == '__main__':
    main()

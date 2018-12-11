import asyncio
import json
import math
from string import Template
from typing import Dict, List

import aiohttp
import asyncio_redis
import prometheus_client
from aiohttp import web

import ws
from etcd_config import lock, EtcdConfig, get_endpoints
from grid import the_grid
from installation import build_installation, Installation
from rpc_util import d64
from transformations import Mat, Vec

BOSS_PORT = 8081

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


async def handle(request):
    name = request.match_info.get('name', 'anon')
    text = "Hello, {}\n".format(name)
    return web.Response(text=text)


async def handle_metrics(request):
    resp = web.Response(body=prometheus_client.generate_latest())
    resp.content_type = prometheus_client.CONTENT_TYPE_LATEST
    return resp


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def motion_detected(inst: Installation, clients: List[ws.WebsocketConnection], msg: Dict):
    data = msg['data']

    cam = inst.cameras[data['cameraName']]
    p0 = Vec(0, 0)
    p1 = Mat.rotz(data['position']) * Vec(5, 0)

    p0 = cam.stand.m * cam.m * p0
    p1 = cam.stand.m * cam.m * p1

    step_size = min(the_grid.get_pixel_size()) / 4.0

    to = p1 - p0
    length = (to).abs()
    direction = to.scale(1.0 / length)

    dx = to.x / length * step_size
    dy = to.y / length * step_size

    initial = p0 + direction.scale(0.5)
    pos_x, pos_y = initial.x, initial.y

    steps = int(length / step_size)
    for i in range(steps):
        prev_xy = the_grid.get(cam, pos_x, pos_y)
        if prev_xy is None:
            break
        the_grid.set(cam, pos_x, pos_y, prev_xy + 0.025)
        pos_x += dx
        pos_y += dy

    focus = Vec(*the_grid.idx_to_xy(the_grid.focus()))

    for head in inst.heads.values():
        m = head.stand.m * head.m
        m_inv = m.inv()

        f = m_inv * focus
        f = f.unit()

        theta = math.atan2(f.y, f.x) * 180 / math.pi

        pos = 200 * theta / 360
        print(head.name, int(pos))

        p0 = m * Vec(0.0, 0.0)
        p1 = m * Mat.rotz(theta) * Vec(5, 0, 0.0)
        drawCmd = {
            "shape": "line",
            "coords": [p0.x, p0.y, p1.x, p1.y],
        }

        for client in clients:  # TODO: should this be a manager command? Or some kind of callback?
            client.draw_queue.put_nowait(drawCmd)

        url = head.url + "/position/{:d}".format(int(pos))
        async with aiohttp.ClientSession() as session:
            print(theta, pos, url)
            await fetch(session, url)


async def run_redis(redis_hostport, ws_manager):
    print("Connecting to redis:", redis_hostport)
    host, port = redis_hostport.split(":")
    connection = await asyncio_redis.Connection.create(host=host, port=int(port))
    print("Connected to redis", redis_hostport)
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe(['the-heads-events'])

    inst = Installation.unmarshal(build_installation("living-room"))

    while True:
        reply = await subscriber.next_published()
        # print('Received: ', repr(reply.value), 'on channel', reply.channel)
        msg = json.loads(reply.value)

        REDIS_MESSAGE_RECEIVED.labels(
            reply.channel,
            msg['type'],
            msg['data']['cameraName'],
        ).inc()

        if msg['type'] == "motion-detected":
            await motion_detected(inst, ws_manager.clients, msg)

            # async with aiohttp.ClientSession() as session:
            #     url = "http://192.168.42.30:8080/position/{}?speed=25".format(data['position'])
            #     text = await fetch(session, url)
            #     print(text)


async def html_handler(request):
    filename = request.match_info.get('name') + ".html"
    with open(filename) as fp:
        contents = Template(fp.read())

    text = contents.safe_substitute()
    return web.Response(text=text, content_type="text/html")


def static_text_handler(extension):
    # TODO: make sure .. not allowed in paths, etc.
    content_type = {
        "js": "text/javascript",
    }[extension]

    async def handler(request):
        filename = request.match_info.get('name') + "." + extension
        with open(filename) as fp:
            text = fp.read()
        return web.Response(text=text, content_type=content_type)

    return handler


def static_binary_handler(extension):
    # TODO: make sure .. not allowed in paths, etc.
    content_type = {
        "png": "image/png",
    }[extension]

    async def handler(request):
        filename = request.match_info.get('name') + "." + extension
        with open(filename, "rb") as fp:
            body = fp.read()
        return web.Response(body=body, content_type=content_type)

    return handler


def random_png(request):
    # width, height = 256 * 2, 256 * 2
    #
    # t0 = time.time()
    #
    # a = np.zeros((height, width, 4), dtype=np.uint8)
    # a[..., 1] = np.random.randint(50, 200, size=(height, width), dtype=np.uint8)
    # a[..., 3] = 255
    #
    # print(time.time() - t0)
    #
    # t0 = time.time()
    # body = png.write_png(a.tobytes(), width, height)
    # print(time.time() - t0)
    #
    # print(len(body))
    body = the_grid.to_png()

    return web.Response(body=body, content_type="image/png")


async def installation_handler(request):
    name = request.match_info.get('installation')

    result = build_installation(name)

    return web.Response(text=json.dumps(result), content_type="application/json")


async def task_handler(request):
    tasks = list(sorted(asyncio.Task.all_tasks(), key=id))
    text = ["tasks: {}".format(len(tasks))]
    for task in tasks:
        text.append("{} {}\n{}".format(
            hex(id(task)),
            task._state,
            str(task)
        ))

    return web.Response(text="\n\n".join(text), content_type="text/plain")


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


async def aquire_lock(cfg):
    lockname = "/the-heads/installation/{installation}/boss/lock".format(**cfg)
    return await lock(cfg['endpoint'], lockname)


def main():
    endpoint = get_endpoints()[0]
    loop = asyncio.get_event_loop()
    cfg = loop.run_until_complete(get_config(endpoint))

    # lock = loop.run_until_complete(aquire_lock(cfg))
    # lock_key = rpc_util.key(lock).decode()
    #
    # # TODO: we may not have the lock here
    # print("obtained lock:", lock_key)

    app = web.Application()

    ws_manager = ws.WebsocketManager()

    asyncio.ensure_future(the_grid.decay())

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/ws', ws_manager.websocket_handler),
        web.get('/installation/{installation}/scene.json', installation_handler),
        web.get('/installation/{installation}/{name}.html', html_handler),
        # web.get('/{name}.html', html_handler),
        web.get('/installation/{installation}/{name}.js', static_text_handler("js")),
        web.get('/installation/{installation}/{seed}/random.png', random_png),
        web.get('/installation/{installation}/{name}.png', static_binary_handler("png")),
        web.get("/tasks", task_handler),
    ])

    loop = asyncio.get_event_loop()

    for redis in cfg['redis_servers']:
        asyncio.ensure_future(run_redis(redis, ws_manager), loop=loop)

    web.run_app(app, port=BOSS_PORT)


if __name__ == '__main__':
    main()

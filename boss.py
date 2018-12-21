import asyncio
import json
import math
from string import Template
from typing import Dict, List

import aiohttp
import asyncio_redis
import os
import prometheus_client
from aiohttp import web
from jinja2 import Environment, FileSystemLoader, select_autoescape

import ws
from consul_config import ConsulBackend
from etcd_config import lock
from config import THE_HEADS_EVENTS, get_args, Config
from grid import the_grid
from health import health_check
from installation import build_installation, Installation
from metrics import handle_metrics
from transformations import Mat, Vec

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


async def home(request):
    cfg = request.app['cfg']['cfg']

    keys = await cfg.get_keys("/the-heads/installation/")

    installations = set(k.split("/")[2] for k in keys)

    jinja_env = request.app['jinja_env']

    template = jinja_env.get_template('boss.html')

    result = template.render(installations=installations)

    return web.Response(text=result, content_type="text/html")


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def head_positioned(inst: Installation, ws_manager: ws.WebsocketManager, msg: Dict):
    print(msg)
    ws_manager.send(msg)


async def motion_detected(inst: Installation, ws_manager: ws.WebsocketManager, msg: Dict):
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

        ws_manager.send({
            "type": "draw",
            "data": {
                "shape": "line",
                "coords": [p0.x, p0.y, p1.x, p1.y],
            }
        })

        consul = ConsulBackend()
        resp, text = await consul.get_nodes_for_service("heads", tags=[head.name])
        assert resp.status == 200
        msg = json.loads(text)

        if len(msg) == 0:
            print("Could not find service registered for {}".format(head.name))

        elif len(msg) > 1:
            print("Found more than one service registered for {}".format(head.name))

        else:
            base_url = "http://{}:{}".format(msg[0]['Address'], msg[0]['ServicePort'])
            url = base_url + "/position/{:d}".format(int(pos))
            async with aiohttp.ClientSession() as session:
                print(theta, pos, url)
                await fetch(session, url)


async def run_redis(redis_hostport, ws_manager, inst: Installation):
    print("Connecting to redis:", redis_hostport)
    host, port = redis_hostport.split(":")
    connection = await asyncio_redis.Connection.create(host=host, port=int(port))
    print("Connected to redis", redis_hostport)
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe([THE_HEADS_EVENTS])

    while True:
        reply = await subscriber.next_published()
        # print('Received: ', repr(reply.value), 'on channel', reply.channel)
        msg = json.loads(reply.value)

        data = msg['data']
        src = data.get('cameraName') or data['headName']

        REDIS_MESSAGE_RECEIVED.labels(
            reply.channel,
            msg['type'],
            src,
        ).inc()

        if msg['type'] == "motion-detected":
            await motion_detected(inst, ws_manager, msg)

        if msg['type'] == "head-positioned":
            await head_positioned(inst, ws_manager, msg)

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
    cfg = request.app['cfg']

    result = await build_installation(name, cfg['cfg'])

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


async def get_config(args):
    endpoint = ConsulBackend(args.config_endpoint)
    cfg = await Config(endpoint).setup(
        installation_override=args.installation
    )

    resp, text = await endpoint.get_nodes_for_service("redis")
    assert resp.status == 200
    msg = json.loads(text)

    redis_servers = ["{}:{}".format(r['Address'], r['ServicePort']) for r in msg]

    assert len(redis_servers) > 0, "Need at least one redis server, for now"

    result = dict(endpoint=args.config_endpoint, installation=cfg.installation, redis_servers=redis_servers, cfg=cfg, )

    print("Using installation:", result['installation'])
    return result


async def aquire_lock(cfg):
    lockname = "/the-heads/installation/{installation}/boss/lock".format(**cfg)
    return await lock(cfg['endpoint'], lockname)


def frontend_handler(*path_prefix):
    async def handler(request):
        filename = request.match_info.get('filename')
        path = os.path.join(*path_prefix, filename)

        ext = os.path.splitext(path)[-1]

        mode = {".png": "rb"}.get(ext, "r")

        print(path)
        with open(path, mode) as fp:
            content = fp.read()

        content_type = {
            ".css": "text/css",
            ".js": "text/javascript",
            ".map": "application/octet-stream",
            ".png": "image/png",
            ".html": "text/html",
        }[ext]

        if mode == "rb":
            return web.Response(body=content, content_type=content_type)
        else:
            return web.Response(text=content, content_type=content_type)

    return handler


def main():
    loop = asyncio.get_event_loop()
    args = get_args()
    cfg = loop.run_until_complete(get_config(args))

    # lock = loop.run_until_complete(aquire_lock(cfg))
    # lock_key = rpc_util.key(lock).decode()
    #
    # # TODO: we may not have the lock here
    # print("obtained lock:", lock_key)

    app = web.Application()
    app['cfg'] = cfg

    jinja_env = Environment(
        loader=FileSystemLoader('templates'),
        autoescape=select_autoescape(['html', 'xml'])
    )

    app['jinja_env'] = jinja_env

    ws_manager = ws.WebsocketManager()

    asyncio.ensure_future(the_grid.decay())

    app.add_routes([
        web.get('/', home),
        web.get('/health', health_check),
        web.get('/metrics', handle_metrics),
        web.get('/ws', ws_manager.websocket_handler),
        web.get('/installation/{installation}/scene.json', installation_handler),
        web.get('/installation/{installation}/{name}.html', html_handler),
        web.get('/installation/{installation}/{name}.js', static_text_handler("js")),
        web.get('/installation/{installation}/{seed}/random.png', random_png),
        web.get('/installation/{installation}/{name}.png', static_binary_handler("png")),
        web.get("/tasks", task_handler),

        # Jenkins' frontend
        web.get("/build/{filename}", frontend_handler("boss-ui/build")),
        web.get("/build/media/{filename}", frontend_handler("boss-ui/build/media")),
        web.get("/static/js/{filename}", frontend_handler("boss-ui/build/static/js")),
        web.get("/static/css/{filename}", frontend_handler("boss-ui/build/static/css")),
    ])

    loop = asyncio.get_event_loop()

    json_inst = loop.run_until_complete(build_installation(cfg['installation'], cfg['cfg']))
    inst = Installation.unmarshal(json_inst)
    app['inst'] = inst

    for redis in cfg['redis_servers']:
        asyncio.ensure_future(run_redis(redis, ws_manager, inst), loop=loop)

    web.run_app(app, port=args.port)


if __name__ == '__main__':
    main()

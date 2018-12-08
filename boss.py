import argparse
import asyncio
import json
from string import Template

import asyncio_redis
import prometheus_client
from aiohttp import web

import ws
from etcd_config import get_config_str, lock, get_prefix
from installation import build_installation, Installation
from rpc_util import d64

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

        for client in ws_manager.clients:
            #     try:
            #         await client.send_json(msg)
            #     except Exception as e:
            #         print(e)
            #         raise

            if msg['type'] == "motion-detected":
                client.motion_detected(inst, msg)

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


def static_handler(extension):
    # TODO: make sure .. not allowed in paths, etc.
    content_type = {
        "js": "text/javascript"
    }[extension]

    async def handler(request):
        filename = request.match_info.get('name') + "." + extension
        with open(filename) as fp:
            text = fp.read()
        return web.Response(text=text, content_type=content_type)

    return handler


async def installation_handler(request):
    name = request.match_info.get('name')

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
    installation = await get_config_str(
        endpoint,
        "/the-heads/machines/{hostname}/installation"
    )
    params = dict(
        installation=installation
    )

    redis_key = "/the-heads/installation/{installation}/redis/".format(**params).encode()
    kv = await get_prefix(
        endpoint,
        redis_key,
    )

    redis_servers = []
    for a in kv:
        rs = d64(a['value']).decode().strip()
        redis_servers.append(rs)

    print("Found {} redis servers".format(len(redis_servers)))
    assert len(redis_servers) > 0

    return dict(
        endpoint=endpoint,
        installation=installation,
        redis_servers=redis_servers,
    )


async def aquire_lock(cfg):
    lockname = "/the-heads/installation/{installation}/boss/lock".format(**cfg)
    return await lock(cfg['endpoint'], lockname)


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--etcd-endpoints', type=str,
                        help="comma-separated list of etcd endpoints")

    args = parser.parse_args()

    assert args.etcd_endpoints

    endpoint = args.etcd_endpoints.split(",")[0]

    loop = asyncio.get_event_loop()
    cfg = loop.run_until_complete(get_config(endpoint))

    # lock = loop.run_until_complete(aquire_lock(cfg))
    # lock_key = rpc_util.key(lock).decode()
    #
    # # TODO: we may not have the lock here
    # print("obtained lock:", lock_key)

    app = web.Application()

    ws_manager = ws.WebsocketManager()

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/ws', ws_manager.websocket_handler),
        web.get('/installations/{name}', installation_handler),
        web.get('/{name}.html', html_handler),
        web.get('/{name}.js', static_handler("js")),
        web.get("/tasks", task_handler),
    ])

    loop = asyncio.get_event_loop()

    for redis in cfg['redis_servers']:
        asyncio.ensure_future(run_redis(redis, ws_manager), loop=loop)

    web.run_app(app, port=BOSS_PORT)


if __name__ == '__main__':
    main()

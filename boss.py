import argparse
import asyncio
import json
from string import Template

import asyncio_redis
import prometheus_client
from aiohttp import web

import ws
from etcd_config import get_config
from installation import build_installation, Installation
from rpc_util import value

PORT = 8080
REDIS = "127.0.0.1"


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


async def run_redis(ws_manager):
    print("Connecting to redis")
    connection = await asyncio_redis.Connection.create(host=REDIS, port=6379)
    print("Connected to redis")
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe(['the-heads-events'])

    inst = Installation.unmarshal(build_installation("living-room"))

    while True:
        reply = await subscriber.next_published()
        print('Received: ', repr(reply.value), 'on channel', reply.channel)
        msg = json.loads(reply.value)

        for client in ws_manager.clients:
            #     try:
            #         await client.send_json(msg)
            #     except Exception as e:
            #         print(e)
            #         raise

            if msg['type'] == "motion-detected":
                await client.motion_detected(inst, msg)

            # async with aiohttp.ClientSession() as session:
            #     url = "http://192.168.42.30:8080/position/{}?speed=25".format(data['position'])
            #     text = await fetch(session, url)
            #     print(text)


async def html_handler(request):
    filename = request.match_info.get('name') + ".html"
    with open(filename) as fp:
        contents = Template(fp.read())

    text = contents.safe_substitute(WS_PORT=PORT)
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


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--etcd-endpoints', type=str,
                        help="comma-separated list of etcd endpoints")

    args = parser.parse_args()

    assert args.etcd_endpoints

    endpoint = args.etcd_endpoints.split(",")[0]

    loop = asyncio.get_event_loop()
    fut = get_config(endpoint, "/the-heads/machines/{hostname}/installation")
    res = loop.run_until_complete(fut)
    print(value(res).decode())

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
    asyncio.ensure_future(run_redis(ws_manager), loop=loop)

    web.run_app(app, port=PORT)


if __name__ == '__main__':
    main()

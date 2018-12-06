import asyncio
import json
import time
from datetime import datetime
from string import Template

import aiohttp
import asyncio_redis
import prometheus_client
from aiohttp import web

from installation import build_installation, Installation
from transformations import Vec, Mat

PORT = 8080
REDIS = "192.168.42.30"


async def handle(request):
    name = request.match_info.get('name', 'anon')
    text = "Hello, {}\n".format(name)
    return web.Response(text=text)


async def handle_metrics(request):
    resp = web.Response(body=prometheus_client.generate_latest())
    resp.content_type = prometheus_client.CONTENT_TYPE_LATEST
    return resp


clients = set()


async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()


async def run_redis():
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

        for client in clients:
            #     try:
            #         await client.send_json(msg)
            #     except Exception as e:
            #         print(e)
            #         raise

            if msg['type'] == "motion-detected":
                data = msg['data']

                cam = inst.cameras[data['cameraName']]
                p0 = Vec(0, 0)
                p1 = Mat.rotz(data['position']) * Vec(5, 0)

                p0 = cam.stand.m * cam.m * p0
                p1 = cam.stand.m * cam.m * p1

                fut = client.send_json({
                    "type": "draw",
                    "data": {
                        "shape": "line",
                        "coords": [p0.x, p0.y, p1.x, p1.y],
                    }
                })
                asyncio.ensure_future(fut)

            # async with aiohttp.ClientSession() as session:
            #     url = "http://192.168.42.30:8080/position/{}?speed=25".format(data['position'])
            #     text = await fetch(session, url)
            #     print(text)


async def websocket_handler(request):
    print("Websocket connect")
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    clients.add(ws)

    await ws.send_json(dict(time=str(datetime.now())))

    await ws.send_json(dict(
        type="draw",
        data=dict(
            shape="line",
            coords=[-1.5, 1, 1.5, 1],
        )
    ))

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            if msg.data == 'close':
                await ws.close()
            else:
                await ws.send_str(msg.data + '/answer')
        elif msg.type == aiohttp.WSMsgType.ERROR:
            print('ws connection closed with exception %s' %
                  ws.exception())

    print('websocket connection closed')
    return ws


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


async def poll_event_loop():
    while True:
        tasks = sorted(asyncio.Task.all_tasks(), key=id)
        print("tasks:", len(tasks))
        for task in tasks:
            print(hex(id(task)), task._state, task)
        await asyncio.sleep(2.5)


def main():
    # print(json.dumps(build_installation("living-room"), indent=2))
    # return
    app = web.Application()

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/ws', websocket_handler),
        web.get('/installations/{name}', installation_handler),
        web.get('/{name}.html', html_handler),
        web.get('/{name}.js', static_handler("js"))
    ])

    loop = asyncio.get_event_loop()
    asyncio.ensure_future(run_redis(loop), loop=loop)
    asyncio.ensure_future(poll_event_loop(), loop=loop)

    web.run_app(app, port=PORT)


if __name__ == '__main__':
    main()

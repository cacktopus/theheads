import asyncio
import json
import os
from datetime import datetime
from glob import glob
from string import Template

import aiohttp
import asyncio_redis
import prometheus_client
import yaml
from aiohttp import web

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

    while True:
        reply = await subscriber.next_published()
        print('Received: ', repr(reply.value), 'on channel', reply.channel)
        msg = json.loads(reply.value)

        for client in clients:
            try:
                await client.send_json(msg)
            except Exception as e:
                print(e)
                raise

        if msg['type'] == "motion-detected":
            data = msg['data']
            async with aiohttp.ClientSession() as session:
                url = "http://192.168.42.30:8080/position/{}?speed=25".format(data['position'])
                text = await fetch(session, url)
                print(text)


async def websocket_handler(request):
    print("Websocket connect")
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    clients.add(ws)

    await ws.send_json(dict(time=str(datetime.now())))

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


def build_installation(name):
    base = os.path.join("etcd", "the-heads", "installations", name)
    if not os.path.exists(base):
        raise web.HTTPNotFound()

    cameras = {}
    for path in glob(os.path.join(base, "cameras/*.yaml")):
        with open(path) as fp:
            camera = yaml.safe_load(fp)
            cameras[camera['name']] = camera

    heads = {}
    for path in glob(os.path.join(base, "heads/*.yaml")):
        with open(path) as fp:
            head = yaml.safe_load(fp)
            heads[head['name']] = head

    stands = {}
    for path in glob(os.path.join(base, "stands/*.yaml")):
        with open(path) as fp:
            stand = yaml.safe_load(fp)
            stands[stand['name']] = stand

    for stand in stands.values():
        stand['cameras'] = [cameras[c] for c in stand['cameras']]
        stand['heads'] = [heads[h] for h in stand['heads']]

    result = dict(
        name=name,
        stands=list(stands.values()),
    )

    return result


async def installation_handler(request):
    name = request.match_info.get('name')

    result = build_installation(name)

    return web.Response(text=json.dumps(result), content_type="application/json")


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
    asyncio.ensure_future(run_redis(), loop=loop)

    web.run_app(app, port=PORT)


if __name__ == '__main__':
    main()

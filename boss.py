import asyncio
import os
from datetime import datetime
from string import Template

import aiohttp
import asyncio_redis
import prometheus_client
from aiohttp import web

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


clients = set()


async def run_redis():
    print("Connecting to redis")
    connection = await asyncio_redis.Connection.create(host=REDIS, port=6379)
    print("Connected to redis")
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe(['heads-events'])

    while True:
        reply = await subscriber.next_published()
        print('Received: ', repr(reply.value), 'on channel', reply.channel)
        for client in clients:
            await client.send_json({
                "msg": "from-redis",
                "data": reply.value,
            })


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


async def installation_handler(request):
    name = request.match_info.get('name')
    base = os.path.join("etcd", "the-heads", "installations", name)
    if not os.path.exists(base):
        raise web.HTTPNotFound()
    return web.Response(text="{}", content_type="application/json")



def main():
    app = web.Application()

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/ws', websocket_handler),
        web.get('/{name}.html', html_handler),
        web.get('/installations/{name}', installation_handler),
    ])

    loop = asyncio.get_event_loop()
    asyncio.ensure_future(run_redis(), loop=loop)

    web.run_app(app, port=PORT)


if __name__ == '__main__':
    main()

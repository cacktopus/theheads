import asyncio

import prometheus_client
from aiohttp import web
import asyncio_redis


async def handle(request):
    name = request.match_info.get('name', 'anon')
    text = "Hello, {}\n".format(name)
    return web.Response(text=text)


async def handle_metrics(request):
    resp = web.Response(body=prometheus_client.generate_latest())
    resp.content_type = prometheus_client.CONTENT_TYPE_LATEST
    return resp


async def run_redis():
    connection = await asyncio_redis.Connection.create(host='127.0.0.1', port=6379)
    print("Connected")
    subscriber = await connection.start_subscribe()
    await subscriber.subscribe(['heads-events'])

    while True:
        reply = await subscriber.next_published()
        print('Received: ', repr(reply.value), 'on channel', reply.channel)


def main():
    app = web.Application()

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
        web.get('/{name}', handle),
    ])

    # web.run_app(app)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run_redis())


if __name__ == '__main__':
    main()

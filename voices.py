# fake voices server
import asyncio

from aiohttp import web

import log
from util import run_app


async def play(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    sync = request.query['isSync']
    print(f"{name} playing: {text}")
    if sync:
        await asyncio.sleep(0.05 * len(text))
    return web.Response(text="ok")


async def process(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    print(f"{name} processing: {text}")
    await asyncio.sleep(0.01)
    return web.Response(text="ok")


async def run(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
        web.get("/process", process),
    ])

    log.info("Running", service="voices", port=port)

    await run_app(app)

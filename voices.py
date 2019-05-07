# fake voices server
from aiohttp import web

from util import run_app


async def play(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    print(f"{name} playing: {text}")
    return web.Response(text="ok")


async def run(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
    ])

    print(f"Running {name} on port {port}")

    await run_app(app)

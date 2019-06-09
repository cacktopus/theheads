import asyncio

from aiohttp import web

import util


async def play(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    print(f"{name} playing: {text}")

    process = asyncio.create_subprocess_exec(
        "afplay",
        "sounds/8001641fa8a95cd192b2402579fd2f.wav"
    )

    await process

    # await asyncio.sleep(0.05 * len(text))
    return web.Response(text=f"ok: {text}")


async def process(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    print(f"{name} processing: {text}")
    await asyncio.sleep(0.01)
    return web.Response(text="ok")


async def setup(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
        web.get("/process", process),
    ])

    print(f"Running {name} on port {port}")

    return app


def main():
    loop = asyncio.get_event_loop()

    app = loop.run_until_complete(setup(
        name="voices",
        port=3031,
    ))

    loop.run_until_complete(util.run_app(app))
    loop.run_forever()


if __name__ == '__main__':
    main()

import asyncio
import os

from aiohttp import web

import process_mary
import util


async def play(request):
    name = request.app['cfg']['name']
    text = request.query['text']
    print(f"{name} playing: {text}")

    for sentence in process_mary.all_parts(process_mary.Rms(), text):
        filename = sentence.hash()

        print(sentence.text, filename)

        if not os.path.isfile(filename):
            return web.Response(status=404, text=f"missing {filename}: [{sentence.text}]")

        process = await asyncio.create_subprocess_exec(
            "afplay",
            filename,
        )

        await process.wait()

    return web.Response(text=f"ok: {text}")


async def setup(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
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

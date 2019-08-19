import asyncio
import os
import platform
import random

from aiohttp import web

import log
import util
from health import health_check, CORS_ALL

play_cmd = "afplay" if platform.system() == "Darwin" else "aplay"


async def _play(sound: str):
    log.info("playing", sound=sound)

    filename = os.path.join("sounds", sound)

    if not os.path.isfile(filename):
        log.error("missing sound", path=os.path.abspath(filename))
        return web.Response(status=404, text=f"missing {filename}", headers=CORS_ALL)

    process = await asyncio.create_subprocess_exec(
        play_cmd,
        filename,
    )

    await process.wait()

    # return web.Response(text="ok")
    return web.Response(text="ok", content_type="application/json", headers=CORS_ALL)


async def play(request):
    sound = request.query['sound']
    return await _play(sound)


async def play_random(request):
    sounds = []
    for (dirpath, dirs, files) in os.walk('sounds'):
        for f in files:
            if f.endswith('.wav'):
                full = os.path.join(dirpath, f)

                full = os.path.relpath(full, "sounds")

                sounds.append(full)

    sound = random.choice(sounds)
    return await _play(sound)


async def setup(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
        web.get("/random", play_random),
        web.get('/health', health_check),
    ])

    log.info("Running", service="voices", port=port)

    return app


def main():
    os.chdir(os.path.expanduser("~"))  # TODO: use config
    loop = asyncio.get_event_loop()

    app = loop.run_until_complete(setup(
        name="voices",
        port=3031,
    ))

    loop.run_until_complete(util.run_app(app))
    loop.run_forever()


if __name__ == '__main__':
    main()

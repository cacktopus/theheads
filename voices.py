import asyncio
import os
import platform

from aiohttp import web

import log
import util
from health import health_check

play_cmd = "afplay" if platform.system() == "Darwin" else "aplay"


async def play(request):
    sound = request.query['sound']
    log.info("playing", sound=sound)

    filename = os.path.join("voices", sound)

    if not os.path.isfile(filename):
        log.error("missing sound", filename=os.path.abspath(filename))
        return web.Response(status=404, text=f"missing {filename}")

    process = await asyncio.create_subprocess_exec(
        play_cmd,
        filename,
    )

    await process.wait()

    return web.Response(text="ok")


async def setup(name: str, port: int):
    app = web.Application()

    app['cfg'] = {
        "port": port,
        "name": name,
    }

    app.add_routes([
        web.get("/play", play),
        web.get('/health', health_check),
    ])

    log.info("Running", service="voices", port=port)

    return app


def main():
    log.setup_logging()

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

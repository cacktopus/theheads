import os

from aiohttp import web

MODEL = "/sys/firmware/devicetree/base/model"


def is_rpi3():
    if os.path.exists(MODEL):
        with open(MODEL) as fp:
            return "Raspberry Pi 3" in fp.read()


async def run_app(app: web.Application):
    port = app['cfg']['port']
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, port=port)
    await site.start()
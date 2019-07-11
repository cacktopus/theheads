import asyncio
import os
import traceback

from aiohttp import web

import log

MODEL = "/sys/firmware/devicetree/base/model"


def is_rpi3():
    if os.path.exists(MODEL):
        with open(MODEL) as fp:
            return "Raspberry Pi 3" in fp.read()


async def run_app(app: web.Application):
    port = app['cfg']['port']
    runner = web.AppRunner(app, access_log=None)
    await runner.setup()
    site = web.TCPSite(runner, port=port)
    await site.start()


async def _task_wrapper(task):
    try:
        await task
    except Exception as e:
        tb = traceback.format_exc()
        log.critical("uncaught exception", traceback=tb)


def create_task(task):
    asyncio.create_task(_task_wrapper(task))

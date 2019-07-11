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


async def _task_wrapper(task, allow_cancel: bool):
    try:
        await task

    except asyncio.CancelledError:
        if allow_cancel:
            log.info("Task was cancelled", task=str(task))
        else:
            log.critical("uncaught exception", traceback=traceback.format_exc())

    except Exception as e:
        log.critical("uncaught exception", traceback=traceback.format_exc())


def create_task(task, allow_cancel=False):
    return asyncio.create_task(_task_wrapper(task, allow_cancel))

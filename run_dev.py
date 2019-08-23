import asyncio

# import boss
import os

import head
import home
import util
import voices
from const import DEFAULT_CONSUL_ENDPOINT
from consul_config import ConsulBackend
from seed_dev_data import head_names


async def run_camera(instance: str, filename: str, port: int):
    process = await asyncio.create_subprocess_exec(
        "./camera",
        "-instance", instance,
        "-filename", filename,
        "-port", f"{port}",
        # stdout=asyncio.subprocess.PIPE,
        # stderr=asyncio.subprocess.PIPE,
        cwd="camera",
    )
    # return await process.wait()


async def run_boss():
    await asyncio.create_subprocess_exec(
        "./boss/boss",
    )


async def run():
    consul_backend = ConsulBackend(DEFAULT_CONSUL_ENDPOINT)
    names = await head_names(consul_backend)
    heads = []

    for i, name in enumerate(names):
        # TODO: use service ports from consul
        app = await head.setup(instance=name, port_override=18080 + i)
        heads.append(util.run_app(app))

    for i, name in enumerate(["voices-01", "voices-02", "voices-03"]):
        # TODO: use service ports from consul
        voice = await voices.setup(name, 3030 + i)
        await util.run_app(voice)

    boss_enabled = not os.environ.get("NO_BOSS", False)

    if boss_enabled:
        await run_boss()
    app3 = await home.setup(port=8000)

    await asyncio.wait(heads + [
        util.run_app(app3),
    ])

    await run_camera("camera-42", "../pi42.raw", 5002)
    await run_camera("camera-43", "../pi43.raw", 5003)


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.run_forever()


if __name__ == '__main__':
    main()

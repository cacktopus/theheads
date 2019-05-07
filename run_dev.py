import asyncio

import boss
import head
import home
import util
import voices
from const import DEFAULT_CONSUL_ENDPOINT
from consul_config import ConsulBackend
from seed_dev_data import head_names


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
        await voices.run(name, 3030 + i)

    app2 = await boss.setup(port=8081)
    app3 = await home.setup(port=8000)

    await asyncio.wait(heads + [
        util.run_app(app2),
        util.run_app(app3),
    ])


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.run_forever()


if __name__ == '__main__':
    main()

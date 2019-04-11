import asyncio

import boss
import head
import home
import util


async def run():
    heads = []
    for i in range(1, 11 + 1):
        app = await head.setup(instance="head-{:02}".format(i), port_override=18080 + i)
        heads.append(util.run_app(app))

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

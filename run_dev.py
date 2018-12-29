import asyncio

import boss
import head
import home
import util


async def run():
    app0 = await head.setup(instance="head0")
    app1 = await head.setup(instance="head1")
    app2 = await boss.setup(installation="dev", port=8081)
    app3 = await home.setup(port=8000)

    await asyncio.wait([
        util.run_app(app0),
        util.run_app(app1),
        util.run_app(app2),
        util.run_app(app3),
    ])


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.run_forever()


if __name__ == '__main__':
    main()

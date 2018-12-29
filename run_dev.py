import asyncio

import boss
import head
import util


async def run():
    app0 = await head.setup(instance="head0")
    app1 = await head.setup(instance="head1")
    app2 = await boss.setup("dev", 8081)

    await asyncio.wait([
        util.run_app(app0),
        util.run_app(app1),
        util.run_app(app2),
    ])


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.run_forever()


if __name__ == '__main__':
    main()

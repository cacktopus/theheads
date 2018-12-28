import asyncio

import head


async def run():
    app0 = await head.setup(instance="head0")
    app1 = await head.setup(instance="head1")

    await asyncio.wait([
        head.run_app(app0),
        head.run_app(app1),
    ])


def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())
    loop.run_forever()


if __name__ == '__main__':
    main()

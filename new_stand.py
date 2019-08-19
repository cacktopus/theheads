import asyncio
import random
import sys

from consul_config import ConsulBackend

tmpl = """
cameras: [camera-{head_id}]
heads: [head-{head_id}]
name: stand-{stand_id:02}
pos: {{x: {x}, y: {y}}}
rot: 0
""".strip()


async def new_stand(stand_id: int, head_id: int):
    consul = ConsulBackend()

    key = f"/the-heads/stands/stand-{stand_id:02}.yaml"

    x = -10 + 20 * random.random()
    y = -10 * random.random()

    val = tmpl.format(
        stand_id=stand_id,
        head_id=head_id,
        x=x,
        y=y,
    )

    print(key)
    print(val)

    await consul.put(key.encode(), val.encode())


def main():
    loop = asyncio.get_event_loop()

    stand_id = int(sys.argv[1])
    head_id = int(sys.argv[2])

    loop.run_until_complete(new_stand(stand_id, head_id))


if __name__ == '__main__':
    main()

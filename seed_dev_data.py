import asyncio
import math
import os
from subprocess import check_output

import yaml

from const import DEFAULT_CONSUL_ENDPOINT
from consul_config import ConsulBackend
from transformations import Vec, Mat

INSTALLATION = "dev"


def setup_positions():
    radius = 20
    spacing = 2
    d0 = Vec(0, radius)

    result = []

    d = d0
    theta = 2 * math.atan2(spacing, (2 * radius))
    theta *= 180 / math.pi

    for i in range(8):
        phi = (3.5 - i) * theta
        p = Mat.rotz(phi) * d - d0
        print(p)
        result.append((p, phi - 90))

    d -= Vec(0, 2 * spacing)
    theta = 2 * math.atan2(2 * spacing, (2 * radius))
    theta *= 180 / math.pi

    for i in range(2):
        phi = (.5 - i) * theta
        p = Mat.rotz(phi) * d - d0
        print(p)
        result.append((p, -90))

    d -= Vec(0, 1.5 * spacing)
    for i in range(1):
        phi = 0
        p = Mat.rotz(phi) * d - d0
        print(p)
        result.append((p, -90))

    return result


async def head_names(consul_backend: ConsulBackend):
    heads = await consul_backend.get_prefix(b"/the-heads/heads/")
    names = []
    for text in heads.values():
        head = yaml.load(text)
        names.append(head['name'])

    assert len(names) == len(set(names)), "head names must be unique"

    return sorted(list(names))


async def main(inst_name: str):
    consul_backend = ConsulBackend(DEFAULT_CONSUL_ENDPOINT)

    async def put(key: str, value: bytes):
        print(key, value)
        resp, _ = await consul_backend.put(key.encode(), value)
        assert resp.status == 200

    async def setup_services():
        home = os.path.expanduser("~")
        check_output(f"{home}/bin/consul kv import @seed_data/hyperborea.json".split())
        # positions = setup_positions()
        #
        # with open('seed_data/{}.yaml'.format(inst_name), "r") as fp:
        #     inst_data = yaml.safe_load(fp)
        #
        # for i, stand in enumerate(inst_data['stands']):
        #     for camera in stand.get('cameras', []):
        #         await put(
        #             "/the-heads/cameras/{}.yaml".format(camera['name']),
        #             yaml.dump(camera, encoding='utf-8'),
        #         )
        #
        #     for head in stand['heads']:
        #         await put(
        #             "/the-heads/heads/{}.yaml".format(head['name']),
        #             yaml.dump(head, encoding='utf-8'),
        #         )
        #
        #     stand['cameras'] = [x['name'] for x in stand.get('cameras', [])]
        #     stand['heads'] = [x['name'] for x in stand['heads']]
        #
        #     pos, rot = positions[i]
        #
        #     stand['pos'] = {"x": pos.x, "y": pos.y}
        #     stand['rot'] = rot
        #
        #     key = "/the-heads/stands/{}.yaml".format(stand['name'])
        #     value = yaml.dump(stand, encoding='utf-8')
        #     await put(key, value)

    async def setup_instances():
        names = await head_names(consul_backend)
        for i, name in enumerate(names):
            await consul_backend.register_service_with_agent("head", 18080 + i, ID=name, tags=[name, "frontend"])

        # redis
        await consul_backend.register_service_with_agent("redis", 6379)

        # boss
        await consul_backend.register_service_with_agent("boss", 8081, ID="boss-01", tags=["boss-01", "frontend"])

        # consul-fe
        await consul_backend.register_service_with_agent("consul-fe", 8500, tags=["frontend"])

        # home
        await consul_backend.register_service_with_agent("home", 8500, tags=["frontend"])

    await setup_services()
    await setup_instances()


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(INSTALLATION))

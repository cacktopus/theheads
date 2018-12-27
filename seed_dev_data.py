import asyncio
import platform

from consul_config import ConsulBackend
from const import DEFAULT_CONSUL_ENDPOINT
import yaml

INSTALLATION = "dev"


async def main(inst_name: str):
    # hostname = platform.node()
    consul_backend = ConsulBackend(DEFAULT_CONSUL_ENDPOINT)

    #
    async def put(key: str, value: bytes):
        print(key, value)
        resp, _ = await consul_backend.put(key.encode(), value)
        assert resp.status == 200

    with open('seed_data/{}.yaml'.format(inst_name), "r") as fp:
        inst_data = yaml.safe_load(fp)

    for stand in inst_data['stands']:
        for camera in stand['cameras']:
            await put(
                "/the-heads/installation/{}/cameras/{}.yaml".format(inst_name, camera['name']),
                yaml.dump(camera, encoding='utf-8'),
            )

        for head in stand['heads']:
            await put(
                "/the-heads/installation/{}/heads/{}.yaml".format(inst_name, head['name']),
                yaml.dump(head, encoding='utf-8'),
            )
    #
    #     stand['cameras'] = [x['name'] for x in stand['cameras']]
    #     stand['heads'] = [x['name'] for x in stand['heads']]
    #     key = "/the-heads/installation/{}/stands/{}.yaml".format(inst_name, stand['name'])
    #     value = yaml.dump(stand, encoding='utf-8')
    #     await put(key, value)

    # heads
    await consul_backend.register_service_with_agent("heads", 8080, ID="head0", tags=["head0"])

    await consul_backend.register_service_with_agent(
        "heads",
        18080,
        ID="vhead0",
        tags=["vhead0"],
    )

    await put(
        "/the-heads/assignment/vhead0",
        inst_name.encode()
    )

    # await put(
    #     "/the-heads/installation/{installation}/heads/{hostname}".format(
    #         installation=inst_name,
    #         hostname=hostname,
    #     ),
    #     b"head0",
    # )
    #
    # # redis
    # await consul_backend.register_service_with_agent("redis", 6379)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(INSTALLATION))

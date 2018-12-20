import asyncio
import platform

from consul_config import ConsulBackend
import yaml

INSTALLATION = "dev"


async def main(inst_name: str):
    hostname = platform.node()
    consul_backend = ConsulBackend("http://127.0.0.1:8500")

    async def put(key: str, value: bytes):
        print(key, value)
        resp, _ = await consul_backend.put(key.encode(), value)
        assert resp.status == 200

    await put(
        "/the-heads/machines/{}/installation".format(hostname),
        inst_name.encode()
    )

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

        stand['cameras'] = [x['name'] for x in stand['cameras']]
        stand['heads'] = [x['name'] for x in stand['heads']]
        key = "/the-heads/installation/{}/stands/{}.yaml".format(inst_name, stand['name'])
        value = yaml.dump(stand, encoding='utf-8')
        await put(key, value)

    await consul_backend.register_service_with_agent("redis", 6379)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(INSTALLATION))

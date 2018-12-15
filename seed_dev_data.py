import asyncio
import platform

from consul_config import ConsulBackend
import yaml


async def main():
    hostname = platform.node()
    be = ConsulBackend("http://127.0.0.1:8500")

    async def put(key: str, value: bytes):
        resp, _ = await be.put(key.encode(), value)
        assert resp.status == 200

    await put(
        "/the-heads/machines/{}/installation".format(hostname),
        b"dev"
    )

    await put(
        "/the-heads/installation/dev/redis/{}".format(hostname),
        b"127.0.0.1:6379"
    )

    with open('seed_data/dev.yaml', "r") as fp:
        inst = yaml.safe_load(fp)

    for stand in inst['stands']:
        for camera in stand['cameras']:
            await put(
                "/the-heads/installation/dev/cameras/{}.yaml".format(camera['name']),
                yaml.dump(camera, encoding='utf-8'),
            )

        for head in stand['heads']:
            await put(
                "/the-heads/installation/dev/heads/{}.yaml".format(head['name']),
                yaml.dump(head, encoding='utf-8'),
            )

        stand['cameras'] = [x['name'] for x in stand['cameras']]
        stand['heads'] = [x['name'] for x in stand['heads']]
        key = "/the-heads/installation/dev/stands/{}.yaml".format(stand['name'])
        value = yaml.dump(stand, encoding='utf-8')
        await put(key, value)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())

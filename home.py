import json
from typing import Tuple

import aiohttp
import argparse
import asyncio

CONSUL_PORT = 8500


async def get(url: str) -> Tuple[int, str]:
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url) as response:
            resp = await response.text()
            return response.status, json.loads(resp)


async def get_nodes_for_service(consul_host: str, service: str):
    path = "/v1/catalog/service/{}".format(service)
    url = "http://{}:{}{}".format(consul_host, CONSUL_PORT, path)

    status, resp = await get(url)
    for node in resp:
        print("{ID}, {Node}, {Address}, {ServiceName}:{ServicePort}".format(**node))


async def get_services(consul_host: str):
    print(consul_host)

    path = "/v1/catalog/services"
    url = "http://{}:{}{}".format(consul_host, CONSUL_PORT, path)

    print(url)

    status, resp = await get(url)
    for name, tags in resp.items():
        print(name, tags)
        await get_nodes_for_service(consul_host, name)


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--consul', type=str, default="127.0.0.1",
                        help="ip of consul agent")

    args = parser.parse_args()

    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_services(args.consul))


if __name__ == '__main__':
    main()

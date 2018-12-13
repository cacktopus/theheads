import json
from typing import Tuple, Dict

import aiohttp
import argparse
import asyncio

from aiohttp import web

CONSUL_PORT = 8500


async def get(url: str) -> Tuple[int, Dict]:
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url) as response:
            resp = await response.text()
            return response.status, json.loads(resp)


async def get_nodes_for_service(consul_host: str, service: str):
    path = "/v1/catalog/service/{}".format(service)
    url = "http://{}:{}{}".format(consul_host, CONSUL_PORT, path)

    status, resp = await get(url)
    assert status == 200
    return resp


async def get_services(consul_host: str):
    print(consul_host)

    path = "/v1/catalog/services"
    url = "http://{}:{}{}".format(consul_host, CONSUL_PORT, path)

    print(url)

    result = {}

    status, resp = await get(url)
    for name, tags in resp.items():
        print(name, tags)
        nodes = await get_nodes_for_service(consul_host, name)
        for node in nodes:
            print("{ID}, {Node}, {Address}, {ServiceName}:{ServicePort}".format(**node))
        result[name] = dict(
            tags=tags,
            nodes=nodes,
        )
    return result


async def handle(request):
    consul_host = request.app['consul_host']
    services = await(get_services(consul_host))
    text = json.dumps(services, indent=4)
    return web.Response(text=text)


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--consul', type=str, default="127.0.0.1",
                        help="ip of consul agent")

    args = parser.parse_args()

    app = web.Application()

    app['consul_host'] = args.consul

    app.add_routes([
        web.get('/', handle),
    ])

    web.run_app(app, port=8082)


if __name__ == '__main__':
    main()

import argparse
import json
from typing import Tuple, Dict

import aiohttp
from aiohttp import web
from jinja2 import Environment, select_autoescape, FileSystemLoader

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
    path = "/v1/catalog/services"
    url = "http://{}:{}{}".format(consul_host, CONSUL_PORT, path)

    result = []

    status, resp = await get(url)
    for name, tags in resp.items():
        nodes = await get_nodes_for_service(consul_host, name)
        result.append(dict(
            name=name,
            tags=tags,
            nodes=nodes,
        ))
    result = sorted(result, key=lambda x: x['name'])
    return result


async def handle(request):
    jinja_env = request.app['jinja_env']
    template = jinja_env.get_template('home.html')

    consul_host = request.app['consul_host']
    services = await(get_services(consul_host))

    result = template.render(services=services)

    return web.Response(text=result, content_type="text/html")


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--consul', type=str, default="127.0.0.1",
                        help="ip of consul agent")

    parser.add_argument('--port', type=int, default=80,
                        help="port to run on")

    args = parser.parse_args()

    app = web.Application()

    app['consul_host'] = args.consul

    jinja_env = Environment(
        loader=FileSystemLoader('templates'),
        autoescape=select_autoescape(['html', 'xml'])
    )

    app['jinja_env'] = jinja_env

    app.add_routes([
        web.get('/', handle),
    ])

    web.run_app(app, port=args.port)


if __name__ == '__main__':
    main()

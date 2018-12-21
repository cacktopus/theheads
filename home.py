import argparse
import asyncio
import json
import platform
from typing import Tuple, Dict

import aiohttp
import prometheus_client
from aiohttp import web
from jinja2 import Environment, select_autoescape, FileSystemLoader

import util
from journald_tail import run_journalctl
from metrics import handle_metrics
from voltage_monitor import monitor_voltage

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


async def get_health_checks_for_service(consul_host: str, service: str):
    path = "/v1/health/checks/{}".format(service)
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
        checks = await get_health_checks_for_service(consul_host, name)
        status = {c['Node']: c['Status'] for c in checks}
        print(status)

        nodes = await get_nodes_for_service(consul_host, name)
        result.append(dict(
            name=name,
            tags=tags,
            nodes=nodes,
            status=status,
        ))
    result = sorted(result, key=lambda x: x['name'])
    return result


async def handle(request):
    jinja_env = request.app['jinja_env']
    template = jinja_env.get_template('home.html')

    consul_host = request.app['consul_host']
    services = await(get_services(consul_host))

    services = [s for s in services if "frontend" in s['tags']]

    hostname = platform.node()
    result = template.render(services=services, hostname=hostname)

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

    if util.is_rpi3():
        low_voltage_observed = prometheus_client.Gauge(
            "rpi_low_voltage_observed",
            "Raspberry PI low voltage observed over observation window",
            []
        )

        asyncio.ensure_future(monitor_voltage(lambda x: low_voltage_observed.set(x)))

    if util.is_rpi3():
        journald_logged = prometheus_client.Counter(
            "journald_logged",
            "Message was logged to journald",
            []
        )

        asyncio.ensure_future(run_journalctl(
            lambda x: journald_logged.inc(),
            lambda x: None,
        ))

    app.add_routes([
        web.get('/', handle),
        web.get('/metrics', handle_metrics),
    ])

    web.run_app(app, port=args.port)


if __name__ == '__main__':
    main()

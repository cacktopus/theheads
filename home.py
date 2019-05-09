import argparse
import asyncio
import json
import platform
from asyncio import subprocess
from typing import Tuple, Dict, Optional

import aiohttp
import prometheus_client
from aiohttp import web
from jinja2 import Environment, select_autoescape, FileSystemLoader

import health
import read_temperature
import util
from journald_tail import run_journalctl
from metrics import handle_metrics
from voltage_monitor import monitor_voltage

CONSUL_PORT = 8500

TEMPERATURE = prometheus_client.Gauge(
    "rpi_cpu_temp_degrees",
    "Raspberry PI CPU temperature in degrees",
    ["zone"],
)


async def get(url: str) -> Tuple[int, Dict]:
    print(url)
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

    port = int(request.app['cfg']['port'])
    port_str = "" if port == 80 else ":{}".format(port)

    consul_host = request.app['consul_host']
    services = await(get_services(consul_host))

    frontend = [s for s in services if "frontend" in s['tags']]
    backend = [s for s in services if "frontend" not in s['tags']]

    services = frontend + backend

    hostname = platform.node()
    result = template.render(services=services, hostname=hostname, home_port=port_str)

    return web.Response(text=result, content_type="text/html")


async def sudo(*cmd):
    proc = await asyncio.create_subprocess_exec(
        "sudo", *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await proc.communicate()

    if proc.returncode == 0:
        return web.Response(text="OK\n", content_type="text/plain")
    else:
        return web.Response(text=f"{stderr.decode()}\n", content_type="text/plain", status=500)

async def stop(request):
    service = request.query['service']
    return await sudo("--non-interactive", "systemctl", "stop", service)


async def start(request):
    service = request.query['service']
    return await sudo("--non-interactive", "systemctl", "start", service)


async def restart(request):
    service = request.query['service']
    return await sudo("--non-interactive", "systemctl", "restart", service)


async def restart_host(request):
    return await sudo("--non-interactive", "shutdown", "-r", "now")

async def shutdown_host(request):
    pw = request.query['pw']
    if pw == '1199':
        return await sudo("--non-interactive", "shutdown", "-h", "now")
    else:
        return web.Response(text="Invalid \n", content_type="text/plain")

async def setup(
        port: int,
        consul_host: Optional[str] = "127.0.0.1",
        use_IPs=False,
):
    app = web.Application()

    app['consul_host'] = consul_host
    app['cfg'] = {
        "port": port,
        "use_ips": use_IPs,
    }

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

        asyncio.ensure_future(read_temperature.monitor_temperatures(TEMPERATURE))

    app.add_routes([
        web.get('/', handle),
        web.get('/health', health.health_check),
        web.get('/metrics', handle_metrics),
        web.get('/stop', stop),
        web.get('/start', start),
        web.get('/restart', restart),
        web.get('/restart-host', restart_host),
        web.get('/shutdown-host', shutdown_host),
    ])

    return app


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--consul', type=str, default="127.0.0.1",
                        help="ip of consul agent")

    parser.add_argument('--port', type=int, default=80,
                        help="port to run on")

    args = parser.parse_args()

    loop = asyncio.get_event_loop()

    app = loop.run_until_complete(setup(
        consul_host=args.consul,
        port=args.port,
    ))

    loop.run_until_complete(util.run_app(app))
    loop.run_forever()


if __name__ == '__main__':
    main()

#!/usr/bin/env python
import asyncio
import json
import time

import prometheus_client
from aiohttp import web
from ina219 import INA219

from metrics import handle_metrics
from util import run_app

SHUNT_OHMS = 0.1

VOLTAGE = prometheus_client.Gauge(
    "power_monitor_voltage",
    "Voltage (V)",
    ["address"],
)

CURRENT = prometheus_client.Gauge(
    "power_monitor_current",
    "Current (A)",
    ["address"],
)

POWER = prometheus_client.Gauge(
    "power_monitor_power",
    "Power (W)",
    ["address"],
)


def read(*addrs):
    inas = [
        (INA219(SHUNT_OHMS, address=addr), addr)
        for addr in addrs
    ]

    for ina, _ in inas:
        ina.configure()

    for ina, addr in inas:
        voltage = ina.voltage()
        current = ina.current()
        power = ina.power()

        data = dict(
            voltage=voltage,
            current=current,
            power=power,
            shunt_voltage=ina.shunt_voltage(),
            t=time.time(),
            addr=hex(addr),
        )

        VOLTAGE.labels(address=hex(addr)).set(voltage)
        POWER.labels(address=hex(addr)).set(power)
        CURRENT.labels(address=hex(addr)).set(current)

        print(json.dumps(data))


async def poll_values():
    while True:
        read(0x40, 0x41)
        await asyncio.sleep(1)


def main():
    loop = asyncio.get_event_loop()

    app = web.Application()
    app['cfg'] = {
        "port": 8083,
    }

    app.add_routes([
        web.get('/metrics', handle_metrics),
    ])

    asyncio.ensure_future(poll_values())

    loop.run_until_complete(run_app(app))
    loop.run_forever()


if __name__ == "__main__":
    main()

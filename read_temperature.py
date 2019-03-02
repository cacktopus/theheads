import asyncio
from glob import glob

THERMAL = "/sys/class/thermal/*/temp"


def _read_temperatures(gauge_metric):
    for filename in glob(THERMAL):
        zone = filename.split("/")[-2]

        with open(filename) as fp:
            temp = int(fp.read())

        t = temp / 1000.0

        gauge_metric.labels(zone).set(t)


async def monitor_temperatures(gauge_metric):
    while True:
        await asyncio.sleep(2)
        _read_temperatures(gauge_metric)

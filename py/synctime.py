import asyncio
import json
import time

import config
import log
from consul_config import ConsulBackend


async def synctime():
    consul = ConsulBackend()
    resp, text = await consul.get_nodes_for_service("home", ['rtc'])

    if resp.status != 200:
        log.error("Error loading rtc nodes")
        return

    msg = json.loads(text)

    hosts = [
        f"http://{h['Address']}:{h['ServicePort']}/time" for h in msg
    ]

    response = await asyncio.gather(*[
        config.get(h) for h in hosts
    ])

    times = []
    for r, text in response:
        assert r.status == 200
        times.append(float(text))

    min_time, max_time = min(times), max(times)

    delta = max_time - min_time

    if delta > 60.0:
        log.error("RTC time difference too great")
        return

    t = max_time

    if abs(time.time() - t) > 60.0:
        log.info("Adjusting clock")
        time.clock_settime(time.CLOCK_REALTIME, t)

    else:
        log.info("No need to adjust time")


def main():
    loop = asyncio.get_event_loop()

    loop.run_until_complete(synctime())


if __name__ == '__main__':
    main()

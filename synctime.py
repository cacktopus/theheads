import asyncio
import json
import time

import config
from consul_config import ConsulBackend


async def synctime():
    consul = ConsulBackend()
    resp, text = await consul.get_nodes_for_service("home", ['rtc'])

    assert resp.status == 200

    msg = json.loads(text)

    print(json.dumps(msg, indent=2))

    hosts = [
        f"http://{h['Address']}:{h['ServicePort']}/time" for h in msg
    ]

    print(hosts)

    response = await asyncio.gather(*[
        config.get(h) for h in hosts
    ])

    times = []
    for r, text in response:
        assert r.status == 200
        times.append(float(text))

    print(times)

    min_time, max_time = min(times), max(times)

    delta = max_time - min_time

    assert delta < 10.0

    t = max_time

    if abs(time.time() - t) > 60.0:
        time.clock_settime(time.CLOCK_REALTIME, t)


def main():
    loop = asyncio.get_event_loop()

    loop.run_until_complete(synctime())


if __name__ == '__main__':
    main()

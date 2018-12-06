import json
import platform

import aiohttp

from rpc_util import e64


async def get_config(etcd_endpoint: str, key_template: str):
    hostname = platform.node()

    url = etcd_endpoint + "/v3beta/kv/range"

    key = key_template.format(**locals()).encode()

    print(key)

    data = json.dumps({
        "key": e64(key),
        "range_end": e64(key + b"\x00"),
    })

    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, data=data) as response:
            resp = await response.text()

    msg = json.loads(resp)
    # print(json.dumps(msg, indent="  "))

    kvs = msg.get('kvs', [])

    if len(kvs) == 0:
        return None

    elif len(kvs) == 1:
        return kvs[0]

    else:
        raise RuntimeError("Unexpected number of results")

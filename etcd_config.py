import json
import platform
from typing import Optional

import aiohttp

from rpc_util import e64, value


class MissingKeyError(RuntimeError):
    pass


async def get(etcd_endpoint: str, key: bytes):
    url = etcd_endpoint + "/v3beta/kv/range"

    print(key.decode())

    data = json.dumps({
        "key": e64(key),
        "range_end": e64(key + b"\x00"),
    })

    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, data=data) as response:
            resp = await response.text()

    msg = json.loads(resp)

    kvs = msg.get('kvs', [])

    if len(kvs) == 0:
        return None

    elif len(kvs) == 1:
        return kvs[0]

    else:
        raise RuntimeError("Unexpected number of results")


async def get_prefix(etcd_endpoint: str, key: bytes):
    url = etcd_endpoint + "/v3beta/kv/range"

    print(key.decode())

    end_key = key[:-1] + bytes([key[-1] + 1])  # TODO: handle overflow case

    data = json.dumps({"key": e64(key), "range_end": e64(end_key), })

    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, data=data) as response:
            resp = await response.text()

    msg = json.loads(resp)

    kvs = msg.get('kvs', [])

    return kvs


async def lock(etcd_endpoint: str, name: str, lease: Optional[int] = 0):
    url = etcd_endpoint + "/v3alpha/lock/lock"
    data = json.dumps({
        "name": e64(name.encode()),
        "lease": lease,
    })

    print("getting lock at", name)

    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, data=data) as response:
            resp = await response.text()

    return json.loads(resp)


async def get_config_str(etcd_endpoint: str, key_template: str, params=None) -> str:
    extra_params = params or {}

    hostname = platform.node()
    params = dict(
        hostname=hostname,
    )
    params.update(extra_params)

    key = key_template.format(**params).encode()

    resp = await get(etcd_endpoint, key)
    if resp is None:
        raise MissingKeyError("Missing key for {}".format(key.decode()))

    result = value(resp)
    if result is None:
        raise MissingKeyError("Missing key for {}".format(key.decode()))

    return result.decode().strip()

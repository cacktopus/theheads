import json
import platform
from typing import Optional

import aiohttp

from rpc_util import e64, value


class MissingKeyError(RuntimeError):
    pass


class EtcdConfig:
    def __init__(self, etcd_endpoint):
        self.etcd_endpoint = etcd_endpoint
        self._params = {}

    async def setup(self):
        hostname = platform.node()
        self._params['hostname'] = hostname
        self._params['installation'] = await self.get_config_str(
            "/the-heads/machines/{hostname}/installation"
        )
        return self

    @property
    def installation(self):
        return self._params['installation']

    async def get(self, key: bytes):
        url = self.etcd_endpoint + "/v3beta/kv/range"

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

    async def get_prefix(self, key_template: str):
        url = self.etcd_endpoint + "/v3beta/kv/range"
        key = key_template.format(**self._params).encode()

        end_key = key[:-1] + bytes([key[-1] + 1])  # TODO: handle overflow case

        data = json.dumps({"key": e64(key), "range_end": e64(end_key), })

        async with aiohttp.ClientSession() as session:
            async with session.post(url=url, data=data) as response:
                resp = await response.text()

        msg = json.loads(resp)

        kvs = msg.get('kvs', [])

        return kvs

    async def get_config_str(self, key_template: str) -> str:
        key = key_template.format(**self._params).encode()

        resp = await self.get(key)
        if resp is None:
            raise MissingKeyError("Missing key for {}".format(key.decode()))

        result = value(resp)
        if result is None:
            raise MissingKeyError("Missing key for {}".format(key.decode()))

        return result.decode().strip()


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

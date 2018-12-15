import argparse
import json
import platform
from typing import Optional, Dict

import aiohttp

from rpc_util import e64, value, d64


class MissingKeyError(RuntimeError):
    pass


ENDPOINTS_FILE = "/etc/etcd/endpoints"
THE_HEADS_EVENTS = 'the-heads-events'


def get_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('--config-endpoint', type=str, default="http://127.0.0.1:8500",
                        help="URL for config service (e.g., consul)")

    parser.add_argument('--installation', type=str,
                        help="Override installation name")

    args = parser.parse_args()
    return args


async def post(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.post(url=url, data=data) as response:
            text = await response.text()
            return response, text


async def get(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url=url) as response:
            text = await response.text()
            return response, text


async def put(url, data):
    async with aiohttp.ClientSession() as session:
        async with session.put(url=url, data=data) as response:
            text = await response.text()
            return response, text


class EtcdBackend:
    def __init__(self, etcd_endpoint):
        self.etcd_endpoint = etcd_endpoint

    async def get(self, key: bytes):
        url = self.etcd_endpoint + "/v3beta/kv/range"

        data = json.dumps({
            "key": e64(key),
            "range_end": e64(key + b"\x00"),
        })

        _, resp = await post(url, data)
        msg = json.loads(resp)

        kvs = msg.get('kvs', [])

        if len(kvs) == 0:
            return None

        elif len(kvs) == 1:
            return kvs[0]

        else:
            raise RuntimeError("Unexpected number of results")

    async def get_prefix(self, key: bytes) -> Dict[bytes, bytes]:
        url = self.etcd_endpoint + "/v3beta/kv/range"

        end_key = key[:-1] + bytes([key[-1] + 1])  # TODO: handle overflow case

        data = json.dumps({"key": e64(key), "range_end": e64(end_key), })

        _, resp = await post(url, data)
        msg = json.loads(resp)

        kvs = msg.get('kvs', [])

        result = {}
        for a in kvs:
            key = d64(a['key'])
            val = d64(a['value'])
            result[key] = val

        return result

    async def get_config_str(self, key: bytes) -> bytes:
        resp = await self.get(key)

        if resp is None:
            raise MissingKeyError("Missing key for {}".format(key.decode()))

        result = value(resp)
        if result is None:
            raise MissingKeyError("Missing key for {}".format(key.decode()))

        return result


class Config:
    def __init__(self, backend):
        self._backend = backend
        self._params = {}

    async def setup(self, installation_override=None):
        hostname = platform.node()
        self._params['hostname'] = hostname
        self._params['installation'] = installation_override or await self.get_config_str(
            "/the-heads/machines/{hostname}/installation"
        )
        return self

    async def get_config_str(self, key_template: str) -> str:
        key = key_template.format(**self._params).encode()

        print("config get", key.decode())

        result = await self._backend.get_config_str(key)

        return result.decode().strip()

    async def get_prefix(self, key_template: str):
        key = key_template.format(**self._params).encode()

        print("config get --prefix", key.decode())

        return await self._backend.get_prefix(key)

    @property
    def installation(self):
        return self._params['installation']


async def lock(etcd_endpoint: str, name: str, lease: Optional[int] = 0):
    url = etcd_endpoint + "/v3alpha/lock/lock"
    data = json.dumps({
        "name": e64(name.encode()),
        "lease": lease,
    })

    print("getting lock at", name)

    _, resp = await post(url, data)

    return json.loads(resp)


async def get_redis(cfg):
    result = await cfg.get_prefix("/the-heads/installation/{installation}/redis/")
    redis_servers = []
    for k, v in sorted(result.items()):
        rs = v.decode().strip()
        redis_servers.append(rs)

    print("Found {} redis servers".format(len(redis_servers)))
    assert len(redis_servers) > 0
    return redis_servers

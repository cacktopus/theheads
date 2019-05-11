import argparse
import platform
from typing import Dict, List

import aiohttp
import yaml

from const import DEFAULT_CONSUL_ENDPOINT

BASE = "http://127.0.0.1:2379"
THE_HEADS_EVENTS = 'the-heads-events'
BOSS_PORT = 8081


def get_args():
    parser = argparse.ArgumentParser()

    parser.add_argument('--config-endpoint', type=str, default=DEFAULT_CONSUL_ENDPOINT,
                        help="URL for config service (e.g., consul)")

    parser.add_argument('--port', type=int, default=BOSS_PORT,
                        help="Port override")

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


class NoDefault:
    pass


class NotFound(Exception):
    pass


class Config:
    def __init__(self, backend):
        self._backend = backend
        self._params = {}

    async def setup(self, instance_name):
        self._params['instance'] = instance_name
        return self

    async def get_config_str(self, key_template: str, default=NoDefault) -> str:
        key = key_template.format(**self._params).encode()

        print("config get", key.decode())

        try:
            result = await self._backend.get_config_str(key)
        except NotFound:
            if default is not NoDefault:
                return default
            raise

        return result.decode().strip()

    async def get_config_yaml(self, key_template: str) -> Dict:
        key = key_template.format(**self._params)
        assert key.endswith(".yaml")

        print("config get -yaml", key)

        result = await self._backend.get_config_str(key.encode())
        return yaml.load(result)

    async def get_prefix(self, key_template: str) -> Dict[bytes, bytes]:
        key = key_template.format(**self._params).encode()

        print("config get --prefix", key.decode())

        return await self._backend.get_prefix(key)

    async def get_keys(self, path_prefix: str) -> List[str]:
        key = path_prefix.format(**self._params)

        print("config get --keys", key)

        return await self._backend.get_keys(key)


async def get_redis(cfg):
    result = await cfg.get_prefix("/the-heads/redis/")
    redis_servers = []
    for k, v in sorted(result.items()):
        rs = v.decode().strip()
        redis_servers.append(rs)

    print("Found {} redis servers".format(len(redis_servers)))
    assert len(redis_servers) > 0
    return redis_servers

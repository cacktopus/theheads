import json
from typing import Dict

from etcd_config import get
from rpc_util import d64


class ConsulBackend:
    def __init__(self, consul_endpoint: str):
        self._consul_endpoint = consul_endpoint

    async def get(self, key: bytes):
        assert key.startswith(b"/")
        url = self._consul_endpoint + "/v1/kv{}".format(key.decode())

        print(url)

        resp, body = await get(url)
        assert resp.status == 200
        result = json.loads(body)
        return result
        # print(result)

    async def get_config_str(self, key: bytes) -> bytes:
        result = await self.get(key)

        assert len(result) == 1

        print(result[0])

        return d64(result[0]['Value'])

    async def get_prefix(self, key: bytes) -> Dict[bytes, bytes]:
        assert key.startswith(b"/")

        url = self._consul_endpoint + "/v1/kv{}?recurse=true".format(key.decode())
        print(url)

        resp, body = await get(url)
        assert resp.status == 200

        kvs = json.loads(body)
        result = {}
        for a in kvs:
            key = a['Key'].encode()
            val = d64(a['Value'])
            result[key] = val

        return result

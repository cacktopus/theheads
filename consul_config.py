import json
from typing import Dict, List

from config import get, put
from rpc_util import d64


class ConsulBackend:
    def __init__(self, consul_endpoint: str):
        self._consul_endpoint = consul_endpoint

    async def get(self, key: bytes):
        assert key.startswith(b"/")
        url = self._consul_endpoint + "/v1/kv{}".format(key.decode())

        resp, body = await get(url)
        assert resp.status == 200
        result = json.loads(body)
        return result

    async def get_config_str(self, key: bytes) -> bytes:
        result = await self.get(key)

        assert len(result) == 1

        return d64(result[0]['Value'])

    async def get_prefix(self, key: bytes) -> Dict[bytes, bytes]:
        assert key.startswith(b"/")

        url = self._consul_endpoint + "/v1/kv{}?recurse=true".format(key.decode())

        resp, body = await get(url)
        assert resp.status == 200

        kvs = json.loads(body)
        result = {}
        for a in kvs:
            key = a['Key'].encode()
            val = d64(a['Value'])
            result[key] = val

        return result

    async def get_keys(self, key_prefix: str) -> List[str]:
        assert key_prefix.startswith("/")

        url = self._consul_endpoint + "/v1/kv{}?keys=true".format(key_prefix)
        resp, body = await get(url)
        assert resp.status == 200

        return json.loads(body)

    async def put(self, key: bytes, value: bytes):
        assert key.startswith(b"/")
        url = self._consul_endpoint + "/v1/kv{}".format(key.decode())
        return await put(url, value)

    async def register_service_with_agent(self, name: str, port: int):
        url = self._consul_endpoint + "/v1/agent/service/register"
        data = json.dumps({
            "Name": name,
            "Port": port,
        })
        return await put(url, data)

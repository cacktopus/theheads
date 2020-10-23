import json
from typing import Optional, Dict

from config import post
from rpc_util import e64, value, d64


class MissingKeyError(RuntimeError):
    pass


ENDPOINTS_FILE = "/etc/etcd/endpoints"


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


async def lock(etcd_endpoint: str, name: str, lease: Optional[int] = 0):
    url = etcd_endpoint + "/v3alpha/lock/lock"
    data = json.dumps({
        "name": e64(name.encode()),
        "lease": lease,
    })

    print("getting lock at", name)

    _, resp = await post(url, data)

    return json.loads(resp)

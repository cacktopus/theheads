import json
from typing import Optional

import requests
import time

from config import BASE
from lease_rpc import grant, revoke, leases, ttl, keepalive
from rpc_util import e64, d64, value


def get(key: bytes):
    url = BASE + "/v3beta/kv/range"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "key": e64(key),
            "range_end": e64(key + b"\x00"),
        })
    )
    assert resp.status_code == 200

    msg = json.loads(resp.text)
    # print(json.dumps(msg, indent="  "))

    kvs = msg.get('kvs', [])

    if len(kvs) == 0:
        return None

    elif len(kvs) == 1:
        return kvs[0]

    else:
        raise RuntimeError("Unexpected number of results")


def lock(name: bytes, lease: Optional[int] = 0):
    url = BASE + "/v3alpha/lock/lock"
    data = json.dumps({
        "name": e64(name),
        "lease": lease,
    })

    resp = requests.post(
        url=url,
        data=data
    )
    print(resp.status_code)
    print(resp.text)
    return json.loads(resp.text)


def unlock(key: bytes):
    url = BASE + "/lock/unlock"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "key": e64(key),
        })
    )
    print(resp.status_code)
    print(resp.text)
    return json.loads(resp.text)


def main():
    result = value(get(b"foo"))
    print(result)

    result = value(get(b"foo\x00"))
    print(result)

    lease_id = grant(120)['ID']

    leases()

    print(lease_id)

    print(ttl(lease_id))

    mylock = lock(b"mylock8", lease_id)
    key = d64(mylock['key'])
    print(key)

    print("key:", get(key))

    print("sleeping")
    time.sleep(5)

    print("keep alive")
    keepalive(lease_id)

    print("sleeping, again")
    time.sleep(30)

    print("unlocking")
    revoke(lease_id)

    print("unlocked?")


if __name__ == '__main__':
    main()

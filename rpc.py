import json
import base64
from typing import Optional

import requests
import time


def e64(s: bytes) -> str:
    return base64.b64encode(s).decode()


def d64(s: str) -> bytes:
    return base64.b64decode(s.encode())


def value(kv: dict) -> Optional[bytes]:
    if kv is None:
        return None

    return base64.b64decode(kv['value'])


def get(key: bytes):
    url = "http://localhost:2379/v3alpha/kv/range"
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


def lock(name: bytes, lease: int):
    url = "http://localhost:2379/v3alpha/lock/lock"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "name": e64(name),
            lease: lease,
        })
    )
    print(resp.status_code)
    print(resp.text)
    return json.loads(resp.text)


def unlock(key: bytes):
    url = "http://localhost:2379/v3alpha/lock/unlock"
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

    mylock = lock(b"mylock5", 1)
    key = d64(mylock['key'])
    print(key)

    print("key:", get(key))

    print("sleeping")
    time.sleep(30)

    print("unlocking")
    unlock(key)

    print("unlocked?")


if __name__ == '__main__':
    main()

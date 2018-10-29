import json

import requests

from config import BASE
from rpc_util import EtcdServerError, e64


def txn():
    test = [{
        "key": e64(b"test"),
        "range_end": e64(b"test\x00"),
        "value": e64(b"orange"),
        "target": "VALUE",
        "result": "EQUAL",
    }]

    success = [{
        "request_put": {
            "key": e64(b"abc"),
            "value": e64(b"It was an apple"),
        }
    }]

    failure = [{
        "request_put": {
            "key": e64(b"abc"),
            "value": e64(b"It was something else"),
        }
    }]

    url = BASE + "/v3beta/kv/txn"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "compare": test,
            "success": success,
            "failure": failure,
        })
    )
    print(resp.status_code)
    print(resp.text)

    assert resp.status_code == 200  # TODO

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg

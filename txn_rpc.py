import json

import requests

from config import BASE
from rpc_util import EtcdServerError, e64, null_logger


def txn(lock_key: bytes, lock_create_revision: int, msg: bytes, log=null_logger):
    test = [{
        "key": e64(lock_key),
        "range_end": e64(lock_key + b"\x00"),
        "create_revision": lock_create_revision,
        "target": "CREATE",
        "result": "EQUAL",
    }]

    success = [{
        "request_put": {
            "key": e64(b"abc"),
            "value": e64(msg),
        }
    }]

    # failure = [{
    #     "request_put": {
    #         "key": e64(b"abc"),
    #         "value": e64(b"I didn't have the lock"),
    #     }
    # }]
    failure = []

    url = BASE + "/v3beta/kv/txn"
    req = json.dumps({"compare": test, "success": success, "failure": failure, })

    log(req)

    resp = requests.post(
        url=url,
        data=req
    )
    log(resp.status_code)
    log(resp.text)

    assert resp.status_code == 200  # TODO

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg

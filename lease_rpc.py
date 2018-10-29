import json
from typing import Optional

import requests

from config import BASE
from rpc_util import EtcdServerError


def grant(ttl: int, lease_id: Optional[int] = 0):
    url = BASE + "/v3beta/lease/grant"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "TTL": ttl,
            "ID": lease_id
        })
    )
    print(resp.status_code)
    print(resp.text)

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg


def ttl(lease_id: str):
    assert isinstance(lease_id, str)
    int(lease_id)

    url = BASE + "/v3beta/kv/lease/timetolive"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "ID": lease_id,
        })
    )
    print(resp.status_code)
    print(resp.text)

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg


def revoke(lease_id: str):
    assert isinstance(lease_id, str)
    int(lease_id)

    url = BASE + "/v3beta/kv/lease/revoke"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "ID": lease_id,
        })
    )
    print(resp.status_code)
    print(resp.text)

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg


def leases():
    url = BASE + "/v3beta/kv/lease/leases"
    resp = requests.post(
        url=url,
        data=json.dumps({})
    )
    print(resp.status_code)
    print(resp.text)

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg


def keepalive(lease_id: str):
    assert isinstance(lease_id, str)
    int(lease_id)

    url = BASE + "/v3beta/lease/keepalive"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "ID": lease_id,
        })
    )
    print(resp.status_code)
    print(resp.text)

    msg = json.loads(resp.text)
    err = msg.get('error')
    if err is not None:
        raise EtcdServerError(err)

    return msg

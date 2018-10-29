import json

import requests

from config import BASE
from rpc_util import EtcdServerError


def grant(ttl: int, lease_id: int):
    url = BASE + "/lease/grant"
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

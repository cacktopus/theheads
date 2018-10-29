import json

import requests

from config import BASE


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
    return json.loads(resp.text)

import json
import os

import requests


class Unset:
    pass


class Client:
    def get(self, path, default=Unset):
        token = os.environ["VAULT_TOKEN"]

        resp = requests.get(
            url=f"http://127.0.0.1:8200/v1/kv/data/{path}",
            headers={
                "X-Vault-Token": token,
            }
        )

        if resp.status_code == 200:
            body = json.loads(resp.text)
            return body['data']['data']

        elif resp.status_code == 404:
            if default is not Unset:
                return default

        assert resp.status_code == 200, resp.status_code

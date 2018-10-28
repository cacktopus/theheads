import json
import base64

import requests


def e64(s: str) -> str:
    return base64.b64encode(s.encode()).decode()


def d64(s: str) -> str:
    return base64.b64decode(s.encode()).decode()


def main():
    url = "http://localhost:2379/v3alpha/kv/range"
    resp = requests.post(
        url=url,
        data=json.dumps({
            "key": e64("foo"),
            "range_end": e64("foo\x00"),
        })
    )
    print(resp.status_code)
    msg = json.loads(resp.text)
    print(json.dumps(msg, indent="  "))

    for r in msg['kvs']:
        print(d64(r['key']))
        print(d64(r['value']))


if __name__ == '__main__':
    main()

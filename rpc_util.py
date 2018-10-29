import base64
from typing import Optional


class EtcdServerError(RuntimeError):
    pass


def e64(s: bytes) -> str:
    return base64.b64encode(s).decode()


def d64(s: str) -> bytes:
    return base64.b64decode(s.encode())


def value(kv: dict) -> Optional[bytes]:
    if kv is None:
        return None

    return base64.b64decode(kv['value'])

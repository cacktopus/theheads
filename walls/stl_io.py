import binascii
import struct
from typing import List


def write_stl(filename, triangles: List):
    with open(filename, "wb") as f:
        f.write(header)

        f.write(len(triangles).to_bytes(4, 'little'))

        for t in triangles:
            f.write(struct.pack("12f2x", *t))
            print(t)


header = binascii.unhexlify("""
53544c422041544620372e362e302e32353120434f4c4f523da0a0a0ff202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020
""".strip())
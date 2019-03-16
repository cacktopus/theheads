import binascii
import struct

from walls import doubles

width, height, depth = 164, 79, 20

header = binascii.unhexlify("""
53544c422041544620372e362e302e32353120434f4c4f523da0a0a0ff202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020
""".strip())


def gen_triangles():
    t0 = [
        (0, 0),
        (width, 0),
        (width, height),
    ]

    t1 = [
        (0, 0),
        (width, height),
        (0, height),
    ]

    for t in t0, t1:
        triangle = []

        n = (0, 0, -1)
        triangle.extend(n)
        for i, (p0, p1) in enumerate(doubles(t)):
            point = (p0[0], p0[1], 0)
            triangle.extend(point)

        yield triangle


def main():
    triangles = list(gen_triangles())

    with open("out.stl", "wb") as f:
        f.write(header)

        f.write(len(triangles).to_bytes(4, 'little'))

        for t in triangles:
            f.write(struct.pack("12f2x", *t))
            print(t)


if __name__ == '__main__':
    main()

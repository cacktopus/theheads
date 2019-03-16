import struct
from typing import Tuple

Vec = Tuple[float, float, float]


def thresh_zero(x):
    return 0.0 if abs(x) < 1E-7 else x


def read_vec(data) -> Tuple[Vec, bytes]:
    fmt = "3f"
    sz = struct.calcsize(fmt)
    buf, data = data[:sz], data[sz:]
    verts = struct.unpack(fmt, buf)
    return (thresh_zero(verts[0]),
            thresh_zero(verts[1]),
            thresh_zero(verts[2])), data


def main():
    with open("box-with-hole.stl", "rb") as f:
        data = f.read()

    header, data = data[:80], data[80:]

    item, data = data[:4], data[4:]
    num_triangles = int.from_bytes(item, 'little')
    print(num_triangles)

    for t in range(num_triangles):
        n, data = read_vec(data)
        p0, data = read_vec(data)
        p1, data = read_vec(data)
        p2, data = read_vec(data)

        print(f" {t} ".center(80, '-'))
        print(f"n  {n}")
        print(f"p0 {p0}")
        print(f"p1 {p1}")
        print(f"p2 {p2}")

        attr_byte_count = int.from_bytes(data[:2], 'little')
        data = data[2:]

        print(attr_byte_count)

    assert len(data) == 0


if __name__ == '__main__':
    main()

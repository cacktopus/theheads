import struct
from typing import Tuple

Vec = Tuple[float, float, float]


def read_vec(data) -> Tuple[Vec, bytes]:
    fmt = "3f"
    sz = struct.calcsize(fmt)
    buf, data = data[:sz], data[sz:]
    verts = struct.unpack(fmt, buf)
    return verts, data


def main():
    with open("cube.stl", "rb") as f:
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


if __name__ == '__main__':
    main()

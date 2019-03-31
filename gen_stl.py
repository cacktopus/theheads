import math

from stl_io import write_stl
from transformations import Vec
from util import doubles

width, height, depth = 146, 79, 2


def build_wall(p0, p1, depth):
    v0, v1 = Vec(*p0), Vec(*p1)
    to = v1 - v0

    n = to.cross(Vec(0.0, 0.0, 1.0)).unit().point3
    a = [*v0.point2, 0.0]
    b = [*v1.point2, 0.0]
    c = [*v1.point2, depth]

    t0 = [*n, *a, *b, *c]

    a = [*v0.point2, 0.0]
    b = [*v1.point2, depth]
    c = [*v0.point2, depth]

    t1 = [*n, *a, *b, *c]

    return t0, t1


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
        for i, (p0, p1) in enumerate(doubles(list(reversed(t)))):
            point = (p0[0], p0[1], 0)
            triangle.extend(point)

        yield triangle

    for t in t0, t1:
        triangle = []

        n = (0, 0, 1)
        triangle.extend(n)
        for i, (p0, p1) in enumerate(doubles(t)):
            point = (p0[0], p0[1], depth)
            triangle.extend(point)

        yield triangle

    t0, t1 = build_wall(
        (width, 0),
        (width, height),
    )
    yield t0
    yield t1

    t0, t1 = build_wall(
        (0, height),
        (0, 0),
    )
    yield t0
    yield t1

    t0, t1 = build_wall(
        (0, 0),
        (width, 0),
    )
    yield t0
    yield t1

    t0, t1 = build_wall(
        (width, height),
        (0, height),
    )
    yield t0
    yield t1


def wave():
    num_points = 4000

    X = list(range(num_points))
    X = [0.03 * x for x in X]

    Y1 = [
        -10 + 10 * math.sin(0.1 * x) for x in X
    ]

    Y2 = [
        +10 + 10 * math.sin(0.1 * x) for x in X
    ]

    for i in range(num_points - 1):
        # sides
        t0, t1 = build_wall(
            (X[i + 0], Y1[i + 0]),
            (X[i + 1], Y1[i + 1])
        )

        yield t0
        yield t1

        t0, t1 = build_wall(
            (X[i + 1], Y2[i + 1]),
            (X[i + 0], Y2[i + 0])
        )

        yield t0
        yield t1

        # bottom
        yield [
            0, 0, -1,
            X[i + 0], Y1[i + 0], 0,
            X[i + 0], Y2[i + 0], 0,
            X[i + 1], Y1[i + 1], 0,
        ]

        yield [
            0, 0, -1,
            X[i + 0], Y2[i + 0], 0,
            X[i + 1], Y2[i + 1], 0,
            X[i + 1], Y1[i + 1], 0,
        ]

        # top
        yield [
            0, 0, 1,
            X[i + 0], Y1[i + 0], depth,
            X[i + 1], Y1[i + 1], depth,
            X[i + 0], Y2[i + 0], depth,
        ]

        yield [
            0, 0, 1,
            X[i + 0], Y2[i + 0], depth,
            X[i + 1], Y1[i + 1], depth,
            X[i + 1], Y2[i + 1], depth,
        ]

        # ends 0
    t0, t1 = build_wall(
        (X[0], Y2[0]),
        (X[0], Y1[0])
    )

    yield t0
    yield t1

    # ends 0
    t0, t1 = build_wall(
        (X[-1], Y1[-1]),
        (X[-1], Y2[-1])
    )

    yield t0
    yield t1


def main():
    triangles = list(wave())
    write_stl("out.stl", triangles)


if __name__ == '__main__':
    main()

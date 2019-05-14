from typing import List, Tuple

from pyhull.convex_hull import ConvexHull

from transformations import Vec
from util import all_pairs
from line import Line2D
from util import doubles


def inset(points, offset: float):
    result = []

    poly = [Vec(*p) for p in points]
    sign = winding(poly)
    signed_offset = sign * offset

    lines = list(generate_offset_lines(poly, signed_offset))

    for l0, l1 in all_pairs(lines):
        p_new = l0.intersect(l1)

        if should_include_point(lines, p_new, sign):
            result.append(p_new.point2)

    if len(result) == 0:
        return None

    convex = make_convex(result)
    return convex


def generate_offset_lines(poly: List[Vec], offset: float):
    for p0, p1 in doubles(poly):
        yield Line2D.from_points(p0, p1).offset(offset)


def should_include_point(lines: List[Line2D], p: Vec, sign: float):
    print("\n", p)
    for line in lines:
        d = sign * line.distance_sq(p)
        print(d, d < -EPSILON)
        if d < -EPSILON:
            return False
    return True


EPSILON = 1E-9


def make_convex(poly: List[Tuple]) -> List[Vec]:
    hull = ConvexHull(poly)

    print(hull.vertices)
    print(hull.points)

    next_vert = dict()
    for bgn, end in hull.vertices:
        next_vert[bgn] = end

    result = []

    i = hull.vertices[0][0]
    for _ in hull.vertices:
        result.append(hull.points[i])
        i = next_vert[i]

    return result


def winding(polys: List[Vec]):
    result = 0
    # for ((x0, y0), (x1, y1)) in doubles(polys):
    for (p0, p1) in doubles(polys):
        # result += (x1 - x0) * (y1 + y0)
        result += (p1.x - p0.x) * (p1.y + p0.y)

    return 1 if result < 0 else -1
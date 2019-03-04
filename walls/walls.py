import itertools
from typing import List

import svgwrite
from bridson import poisson_disc_samples
from pyhull.convex_hull import ConvexHull
from pyhull.voronoi import VoronoiTess

from line import Line2D
from transformations import Vec

EPSILON = 1E-9

MAX_X = 1000
MAX_Y = 1000


def rotate(items):
    return items[1:] + [items[0]]


def triples(items):
    for _ in items:
        yield items[:3]
        items = rotate(items)


def doubles(items):
    for _ in items:
        yield items[:2]
        items = rotate(items)


def winding(polys: List[Vec]):
    result = 0
    # for ((x0, y0), (x1, y1)) in doubles(polys):
    for (p0, p1) in doubles(polys):
        # result += (x1 - x0) * (y1 + y0)
        result += (p1.x - p0.x) * (p1.y + p0.y)

    return 1 if result < 0 else -1


def should_include_point(lines: List[Line2D], p: Vec, sign: float):
    print("\n", p)
    for line in lines:
        d = sign * line.distance_sq(p)
        print(d, d < -EPSILON)
        if d < -EPSILON:
            return False
    return True


def generate_offset_lines(poly: List[Vec], offset: float):
    for p0, p1 in doubles(poly):
        yield Line2D.from_points(p0, p1).offset(offset)


def all_pairs(items):
    yield from itertools.combinations(items, 2)


def make_convex(poly: List[Vec]) -> List[Vec]:
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


def inset(svg, points, offset: float):
    result = []

    poly = [Vec(*p) for p in points]
    sign = winding(poly)
    signed_offset = sign * offset

    lines = list(generate_offset_lines(poly, signed_offset))

    for line in lines:
        svg.add(svg.circle(line.p.point2, 1, fill='magenta'))
        p0 = line.p + line.u.scale(0)
        p1 = line.p + line.u.scale(500)
        svg.add(svg.line(p0.point2, p1.point2, stroke='black', stroke_width=0.2))

    for l0, l1 in all_pairs(lines):
        p_new = l0.intersect(l1)

        if should_include_point(lines, p_new, sign):
            if good(p_new.point2):
                svg.add(svg.circle(p_new.point2, 1, fill='green'))
            result.append(p_new.point2)
        else:
            if good(p_new.point2):
                svg.add(svg.circle(p_new.point2, 1, fill='red'))

    return make_convex(result)


def good(p):
    return 0 < p[0] < MAX_X and 0 < p[1] < MAX_Y


def main():
    points = poisson_disc_samples(width=MAX_X, height=MAX_Y, r=50)
    # print(len(points))

    svg = svgwrite.Drawing('test.svg', profile='tiny')
    # dwg.add(dwg.line((0, 0), (100, 100), stroke=svgwrite.rgb(10, 10, 16, '%')))
    # dwg.add(dwg.text('Test', insert=(20, 20)))

    v = VoronoiTess(points)
    # print(dir(v))
    # print(v.vertices)
    # print(v.ridges)
    # print(v.dim)
    # print(v.regions)

    # for p in points:
    #     s.add(s.circle(p, 2))

    # for p in v.vertices:
    #     if 500 > p[0] > 0 and 500 > p[1] > 0:
    #         s.add(s.circle(p, 1))

    count = 0

    # __p = [
    #     [402, 107],
    #     [316, 68],
    #     [399, 38],
    #     [413, 83],
    #     [403, 106],
    # ]

    __p = [[395.4236064945018, 124.6003154593059], [417.2044240544242, 134.4926919229175],
           [477.140818910828, 96.7637774099614], [405.4868577426532, 35.73168464501639],
           [372.383738467881, 72.63759223463302]]

    for region in v.regions:
        points = [v.vertices[i] for i in region]
        # points = __p
        if all(good(p) for p in points):
            print("points", points)
            svg.add(svg.polygon(points, fill='grey'))
            count += 1
            try:
                poly = inset(svg, points, 5)
            except Exception as e:
                print(e)
                raise
                break
            print(len(poly))
            print(poly)

            svg.add(svg.polygon(poly, fill='red'))
            # break

    svg.save()


if __name__ == '__main__':
    main()

import itertools
import math
import os
from collections import defaultdict
from typing import List, Tuple

import svgwrite
import svgwrite.container
from bridson import poisson_disc_samples
from pyhull.convex_hull import ConvexHull
from pyhull.delaunay import DelaunayTri
from pyhull.voronoi import VoronoiTess

from line import Line2D
from transformations import Vec

import Polygon

EPSILON = 1E-9

MAX_X = 500
MAX_Y = 500
R = 15
WIDTH = 4.5


class DebugSVG:
    def __init__(self, filename):
        base, ext = os.path.splitext(filename)
        self._prod = svgwrite.Drawing(base + ext, profile='tiny')
        self._debug = svgwrite.Drawing(base + "-debug" + ext, profile='tiny')
        self._prod_g = svgwrite.container.Group()
        self._prod_g.scale(1.7)
        self._prod_g.translate(-250, -200 + 12.5 + 12.5 / 2)
        self._prod.add(self._prod_g)

    def save(self):
        self._prod.save()
        self._debug.save()

    def add(self, *args):
        self._prod_g.add(*args)
        self._debug.add(*args)

    @property
    def svg(self):
        return self._prod

    def prod(self, *args):
        self._prod_g.add(*args)

    def debug(self, *args):
        self._debug.add(*args)


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


def inset(svg, points, offset: float):
    result = []

    poly = [Vec(*p) for p in points]
    sign = winding(poly)
    signed_offset = sign * offset

    lines = list(generate_offset_lines(poly, signed_offset))

    for line in lines:
        # svg.debug(svg.svg.circle(line.p.point2, 1, fill='magenta'))
        p0 = line.p + line.u.scale(0)
        p1 = line.p + line.u.scale(500)
        # svg.debug(svg.svg.line(p0.point2, p1.point2, stroke='black', stroke_width=0.2))

    for l0, l1 in all_pairs(lines):
        p_new = l0.intersect(l1)

        if should_include_point(lines, p_new, sign):
            if good(p_new.point2):
                pass  # svg.debug(svg.svg.circle(p_new.point2, 1, fill='green'))
            result.append(p_new.point2)
        else:
            if good(p_new.point2):
                pass  # svg.debug(svg.svg.circle(p_new.point2, 1, fill='red'))

    return make_convex(result)


def good(p):
    return 0 < p[0] < MAX_X and 0 < p[1] < MAX_Y


def centroid(triangle: List[Tuple]):
    assert len(triangle) == 3
    x = sum(p[0] for p in triangle) / 3
    y = sum(p[1] for p in triangle) / 3

    return x, y


def circumcenter(triangle: List[Tuple]):
    a, b, c = triangle
    ax, ay = a
    bx, by = b
    cx, cy = c

    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))

    ux = (1 / d) * (
            (ax ** 2 + ay ** 2) * (by - cy) +
            (bx ** 2 + by ** 2) * (cy - ay) +
            (cx ** 2 + cy ** 2) * (ay - by)
    )

    uy = (1 / d) * (
            (ax ** 2 + ay ** 2) * (cx - bx) +
            (bx ** 2 + by ** 2) * (ax - cx) +
            (cx ** 2 + cy ** 2) * (bx - ax)
    )

    return ux, uy


def circumcenter_centroid_lerp(ratio: float, triangle: List[Tuple]) -> Tuple:
    p0 = Vec(*circumcenter(triangle))
    p1 = Vec(*centroid(triangle))

    u = p1 - p0

    result = p0 + u.scale(ratio)

    return result.point2


def spooky_cells(dely: DelaunayTri):
    cells = defaultdict(list)

    for v in dely.vertices:
        for i in v:
            triangle = [dely.points[a] for a in v]
            center = circumcenter_centroid_lerp(0.6, triangle)
            cells[i].append(center)

    return cells


def process(svg, window, poly):
    if all(good(p) for p in poly):
        print("points", poly)

        try:
            poly = inset(svg, poly, WIDTH / 2)
        except Exception as e:
            print(e)
            raise

        result = list(window & Polygon.Polygon(poly))
        print(result)

        if len(result):
            add = svg.svg.polygon(result[0], fill='black', opacity=0.40)
            svg.add(add)


def distance(p0, p1):
    return math.sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2)


def fun_circles(svg):
    points = poisson_disc_samples(width=MAX_X, height=MAX_Y, r=R)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    for i, point in enumerate(points):
        r = radii[i] - 0.66
        svg.debug(
            svg.svg.circle(point, r, fill='black', stroke='black', fill_opacity=1.0, stroke_opacity=1.0,
                           stroke_width=0.5))


def main():
    svg = DebugSVG("test.svg")

    try:
        points = poisson_disc_samples(width=MAX_X, height=MAX_Y, r=R)

        for point in points:
            svg.debug(svg.svg.circle(point, R / 2, fill='white', stroke='black', fill_opacity=0.0, stroke_opacity=0.5,
                                     stroke_width=0.5))

        dely = DelaunayTri(points)
        for v in dely.vertices:
            pts = [dely.points[p] for p in v]
            if all(50 < x < 450 and 50 < y < 350 for (x, y) in pts):
                svg.debug(svg.svg.polygon(pts, fill='white', stroke='green', stroke_opacity=0.50, fill_opacity=0.0,
                                          stroke_width=0.5))

        window = Polygon.Polygon([[100, 100], [100, 275 - 12.5], [400, 275 - 12.5], [400, 100]])

        cells = spooky_cells(dely)
        for i, cell in sorted(cells.items()):
            if all(50 < x < 450 and 50 < y < 350 for (x, y) in cell):
                for point in cell:
                    svg.debug(svg.svg.circle(point, 1, fill='magenta', stroke='magenta'))
                fixed = make_convex(cell)
                svg.debug(svg.svg.polygon(fixed, fill='red', stroke='red', opacity=0.50))
                process(svg, window, fixed)

        v = VoronoiTess(points)
        count = 0

        # for region in v.regions:
        #     points = [v.vertices[i] for i in region]
        #     process(svg, window, points)
        #     count += 1

    except:
        raise

    finally:
        svg.save()


if __name__ == '__main__':
    main()

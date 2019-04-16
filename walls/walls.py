import itertools
import math
from collections import defaultdict
from dataclasses import dataclass
from typing import List, Tuple

import Polygon, Polygon.IO
from bridson import poisson_disc_samples
from pyhull.convex_hull import ConvexHull
from pyhull.delaunay import DelaunayTri
from pyhull.voronoi import VoronoiTess

from debug_svg import DebugSVG
from geom import tess, circle_points, centroid, make_stl
from line import Line2D
from transformations import Vec
# Ideas
# Cull small or narrow cells
# Leave some cells filled in
from util import doubles

EPSILON = 1E-9


@dataclass
class Config:
    width: float
    height: float
    depth: float
    r: float
    line_width: float
    pad_x: float
    pad_y: float

    x0: float
    y0: float
    max_x: float
    max_y: float


inner = Config(
    r=13.5,
    line_width=2.0,
    pad_x=15,
    pad_y=7.5,

    width=106,
    height=79,
    depth=1.75,

    x0=100,
    y0=100,
    max_x=500,
    max_y=500,
)

outer = Config(
    r=8,
    line_width=2,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=1.75,

    x0=100,
    y0=100,
    max_x=500,
    max_y=500,
)

circles_cfg = Config(
    r=8,
    line_width=2,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=1.75,

    x0=25,
    y0=25,
    max_x=50 + 146,
    max_y=50 + 146,
)

cfg = outer


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
    return 0 < p[0] < cfg.max_x and 0 < p[1] < cfg.max_y


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
            poly = inset(svg, poly, cfg.line_width / 2.0)
        except Exception as e:
            print(e)
            raise

        result = list(window & Polygon.Polygon(poly))
        print(result)

        if len(result):
            assert len(result) == 1
            yield result[0]


def distance(p0, p1):
    return math.sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2)


def fun_circles(svg):
    x0, y0 = cfg.x0, cfg.y0
    x1, y1 = x0 + cfg.width, y0 + cfg.height

    wall = Polygon.Polygon([
        (x0, y0),
        (x1, y0),
        (x1, y1),
        (x0, y1),
    ])

    window = [
        (x0 + cfg.pad_x, y0 + cfg.pad_y),
        (x1 - cfg.pad_x, y0 + cfg.pad_y),
        (x1 - cfg.pad_x, y1 - cfg.pad_y),
        (x0 + cfg.pad_x, y1 - cfg.pad_y),
    ]
    window_p = Polygon.Polygon(window)

    points = poisson_disc_samples(width=cfg.max_x, height=cfg.max_y, r=cfg.r * 0.80)

    radii = {}
    for i in range(len(points)):
        radii[i] = min(distance(points[i], points[j]) for j in range(len(points)) if i != j) / 2

    result = Polygon.Polygon()

    for i, point in enumerate(points):
        r = radii[i] * 0.95
        center = Vec(*point)
        points = circle_points(center, r, 20)

        # for p0, p1 in doubles(points):
        #     svg.debug(svg.svg.line(
        #         p0.point2, p1.point2, stroke='black', stroke_width=0.5
        #     ))

        poly = Polygon.Polygon([p.point2 for p in points]) & window_p
        result = result + poly

    # a_circle = Polygon.Polygon([p.point2 for p in circle_points(Vec(75, 75), 10, 20)])
    #
    result = wall - result

    holes = []
    contours = []
    for i in range(len(result)):
        cont = result[i]
        contours.append(list(reversed(cont)))  # Not sure why I need to reverse here, but we have the wrong orientation
        print(result.orientation(i), result.isHole(i), cont)

        if result.isHole(i):
            h = centroid(cont)
            holes.append(h)

    B, A = tess(contours, holes)
    make_stl("fun-circles", contours, B, A, 1.75)


def bounding_box(poly):
    min_x = min(v[0] for v in poly)
    max_x = max(v[0] for v in poly)

    min_y = min(v[1] for v in poly)
    max_y = max(v[1] for v in poly)

    return (min_x, min_y), (max_x, max_y)


def make_wall(name):
    svg = DebugSVG(f"{name}-test.svg")

    try:
        points = poisson_disc_samples(width=cfg.max_x, height=cfg.max_y, r=cfg.r)

        for point in points:
            svg.debug(
                svg.svg.circle(point, cfg.r / 2, fill='white', stroke='black', fill_opacity=0.0, stroke_opacity=0.5,
                               stroke_width=0.5))

        dely = DelaunayTri(points)
        for v in dely.vertices:
            pts = [dely.points[p] for p in v]
            if all(50 < x < 450 and 50 < y < 350 for (x, y) in pts):
                svg.debug(svg.svg.polygon(pts, fill='white', stroke='green', stroke_opacity=0.50, fill_opacity=0.0,
                                          stroke_width=0.5))

        # width = 146
        x0, y0 = cfg.x0, cfg.y0
        x1, y1 = x0 + cfg.width, y0 + cfg.height

        wall = [
            (x0, y0),
            (x1, y0),
            (x1, y1),
            (x0, y1),
        ]

        window = [
            (x0 + cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y1 - cfg.pad_y),
            (x0 + cfg.pad_x, y1 - cfg.pad_y),
        ]
        window_p = Polygon.Polygon(window)

        cells = spooky_cells(dely)

        results = [wall]

        for i, cell in sorted(cells.items()):
            if all(50 < x < 450 and 50 < y < 350 for (x, y) in cell):
                for point in cell:
                    svg.debug(svg.svg.circle(point, 1, fill='magenta', stroke='magenta'))
                fixed = make_convex(cell)
                svg.debug(svg.svg.polygon(fixed, fill='red', stroke='red', opacity=0.50))
                for p in process(svg, window_p, fixed):
                    results.append(p)
                    add = svg.svg.polygon(p, fill='black', opacity=0.40)
                    svg.add(add)

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

    holes = []
    for poly in results[1:]:
        hole = centroid(poly)
        holes.append(hole)

    # print(results)
    tess(name, results, holes, cfg.depth)


def main():
    global cfg
    cfg = circles_cfg
    svg = DebugSVG(f"fun-circles.svg")
    fun_circles(svg)
    svg.save()

    cfg = outer
    for i in (1,):
        make_wall(f"wall{i}")


if __name__ == '__main__':
    main()

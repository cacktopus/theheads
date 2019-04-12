import itertools
import math
import os
from collections import defaultdict
from dataclasses import dataclass
from typing import List, Tuple

import Polygon, Polygon.IO
import matplotlib.pyplot as plt
import svgwrite
import svgwrite.container
import triangle as tr
from bridson import poisson_disc_samples
from pyhull.convex_hull import ConvexHull
from pyhull.delaunay import DelaunayTri
from pyhull.voronoi import VoronoiTess

from gen_stl import build_wall
from geom import circle
from line import Line2D
from stl_io import write_stl
from transformations import Vec
# Ideas
# Cull small or narrow cells
# Leave some cells filled in
from util import doubles

EPSILON = 1E-9

MAX_X = 500
MAX_Y = 500


@dataclass
class Config:
    width: float
    height: float
    depth: float
    r: float
    line_width: float
    pad_x: float
    pad_y: float

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

    max_x=500,
    max_y=500,
)

cfg = outer


class DebugSVG:
    def __init__(self, filename):
        base, ext = os.path.splitext(filename)
        self._prod = svgwrite.Drawing(base + ext, profile='tiny')
        self._debug = svgwrite.Drawing(base + "-debug" + ext, profile='tiny')
        self._prod_g = svgwrite.container.Group()
        self._debug_g = svgwrite.container.Group()
        # self._prod_g.scale(1.7)
        # self._prod_g.translate(-250, -200 + 12.5 + 12.5 / 2)
        self._prod.add(self._prod_g)
        self._debug.add(self._debug_g)

    def save(self):
        self._prod.save()
        self._debug.save()

    def add(self, *args):
        self._prod_g.add(*args)
        self._debug_g.add(*args)

    @property
    def svg(self):
        return self._prod

    def prod(self, *args):
        self._prod_g.add(*args)

    def debug(self, *args):
        self._debug_g.add(*args)


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
    assert len(triangle) >= 3
    x = sum(p[0] for p in triangle) / len(triangle)
    y = sum(p[1] for p in triangle) / len(triangle)

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


def circle_points(center: Vec, radius: float, steps: int):
    result = []
    for i in range(steps):
        t = i / steps
        result.append(circle(center, radius, t))
    return result


def fun_circles(svg):
    x0, y0 = 25, 25
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

    points = poisson_disc_samples(width=MAX_X, height=MAX_Y, r=cfg.r * 0.80)

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

    for i in range(len(result)):
        cont = result[i]
        print(result.orientation(i), cont)

        for p0, p1 in doubles(cont):
            svg.debug(svg.svg.line(
                p0, p1, stroke='black', stroke_width=0.5
            ))


def tess(name, polys, depth):
    indices = {}
    vertices = []
    segments = []
    holes = []

    for i, poly in enumerate(polys):
        for v in poly:
            assert isinstance(v, tuple)
            if v not in indices:
                pos = len(vertices)
                indices[v] = pos
                vertices.append(v)

        for v0, v1 in doubles(poly):
            # TODO: check for duplicate segment
            index0 = indices[v0]
            index1 = indices[v1]

            segments.append((index0, index1))

        if i > 0:
            hole = centroid(poly)
            holes.append(hole)

    A = dict(
        vertices=vertices,
        segments=segments,
        holes=holes,
    )

    B = tr.triangulate(A, opts="pq")
    tr.compare(plt, A, B)

    svg = DebugSVG(f"{name}-new.svg")
    svg._prod_g.scale(3)
    svg._debug_g.scale(3)

    verts = B['vertices']
    tris = B['triangles']
    segs = B['segments']

    for h in holes:
        svg.debug(svg.svg.circle(h, 1, fill='magenta', stroke='magenta'))

    stl = []
    for tri in tris:
        poly = [verts[i] for i in tri]
        svg.add(svg.svg.polygon(
            poly,
            fill_opacity=0.0,
            stroke_opacity=1.00,
            stroke='black',
            stroke_width=0.2,
        ))

        p0, p1, p2 = poly

        stl.append([
            0, 0, -1,
            p0[0], p0[1], depth,
            p1[0], p1[1], depth,
            p2[0], p2[1], depth,
        ])

        stl.append([
            0, 0, 1,
            p2[0], p2[1], 0,
            p1[0], p1[1], 0,
            p0[0], p0[1], 0,
        ])

    outer, holes = polys[0], polys[1:]
    for v0, v1 in doubles(outer):
        svg.debug(svg.svg.line(v0, v1, stroke='black', stroke_width=1.0))
        wall = build_wall(v0, v1, depth)
        stl.extend(wall)

    for hole in holes:
        for v0, v1 in doubles(hole):
            svg.debug(svg.svg.line(v0, v1, stroke='black', stroke_width=1.0))
            wall = build_wall(v0, v1, depth)
            stl.extend(wall)

    svg.save()
    write_stl(f"{name}.stl", stl)


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
        x0, y0 = 100, 100
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

    # print(results)
    tess(name, results, cfg.depth)


def main():
    # svg = DebugSVG(f"fun-circles.svg")
    # fun_circles(svg)
    # svg.save()

    for i in (1,):
        make_wall(f"wall{i}")


if __name__ == '__main__':
    main()

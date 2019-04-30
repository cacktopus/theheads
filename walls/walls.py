import itertools
import random
from collections import defaultdict
from math import pi
from typing import List, Tuple

import Polygon
import Polygon.IO
import noise
from bridson import poisson_disc_samples
from pyhull.convex_hull import ConvexHull
from pyhull.delaunay import DelaunayTri

import geom
from config import Config
from geom import tess, centroid, make_stl, circle_points
from line import Line2D
from transformations import Vec
from util import doubles
import svgwrite

# Ideas
# Cull small or narrow cells
# Leave some cells filled in


EPSILON = 1E-9

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
    r=6,
    line_width=1.175,
    pad_x=8,
    pad_y=4,

    width=146,
    height=79,
    depth=1.75,

    x0=100,
    y0=100,
    max_x=600,
    max_y=300,
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


def bounding_box(poly):
    min_x = min(v[0] for v in poly)
    max_x = max(v[0] for v in poly)

    min_y = min(v[1] for v in poly)
    max_y = max(v[1] for v in poly)

    return (min_x, min_y), (max_x, max_y)


class Wall:
    def __init__(self, name, cfg, x_offset=0):
        x0 = cfg.x0 + x_offset
        y0 = cfg.y0
        x1 = x0 + cfg.width
        y1 = y0 + cfg.height

        self.cfg = cfg

        self.x0, self.y0 = x0, y0
        self.x1, self.y1 = x1, y1
        self.name = name

        self.wall = Polygon.Polygon([
            (x0, y0),
            (x1, y0),
            (x1, y1),
            (x0, y1),
        ])

        self.window = Polygon.Polygon([
            (x0 + cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y0 + cfg.pad_y),
            (x1 - cfg.pad_x, y1 - cfg.pad_y),
            (x0 + cfg.pad_x, y1 - cfg.pad_y),
        ])

        self.result = Polygon.Polygon()

    def make_stl(self):
        holes = []
        contours = []
        for i in range(len(self.result)):
            cont = self.result[i]
            contours.append(
                list(reversed(cont)))  # Not sure why I need to reverse here, but we have the wrong orientation
            print(self.result.orientation(i), self.result.isHole(i), cont)

            if self.result.isHole(i):
                h = centroid(cont)
                holes.append(h)

        B, A = tess(contours, holes)
        make_stl(self.name, contours, B, A, 1.75)

    def to_svg(self, svg):
        svg = svg or svgwrite.Drawing(f'{self.name}.svg', profile='tiny')
        # dwg.add(dwg.line((0, 0), (10, 0), stroke=svgwrite.rgb(10, 10, 16, '%')))
        # dwg.add(dwg.text('Test', insert=(0, 0.2), fill='red'))
        for i in range(len(self.result)):
            cont = self.result[i]
            # print(self.result.orientation(i), self.result.isHole(i), cont)
            svg.add(svg.polygon(cont, fill_opacity=0, stroke="black", stroke_width=0.25))

        svg.save()

    def make(self, prod_svg, debug_svg):
        x0, y0 = self.x0, self.y0
        x1, y1 = self.x1, self.y1

        b0 = (x1 - x0) / 2 - (6.125 + 7.5)
        block = Polygon.Polygon([
            (x0 + b0, y0 + 0),
            (x1 - b0, y0 + 0),
            (x1 - b0, y0 + 14.25 + 7.5),
            (x0 + b0, y0 + 14.25 + 7.5),
        ])

        b1 = (x1 - x0) / 2 - 6.125
        tunnel = Polygon.Polygon([
            (x0 + b1, y0 + -10),
            (x1 - b1, y0 + -10),
            (x1 - b1, y0 + 14.25),
            (x0 + b1, y0 + 14.25),
        ])

        width = (x1 - x0) + 150
        height = (y1 - y0) + 150
        points = poisson_disc_samples(width=width, height=height, r=self.cfg.r)

        points = [(p[0] + x0 - 75, y1 - p[1] + 75) for p in points]

        # for p in points:
        #     prod_svg.add(prod_svg.circle(p, 0.5, fill="green"))

        dely = DelaunayTri(points)
        cells = spooky_cells(dely)

        wx0 = min(p[0] for p in self.window[0])
        wx1 = max(p[0] for p in self.window[0])

        g0 = Graph(prod_svg, (wx0, wx1), (10, 10 + 30), (0.0, 1.0), "darkblue")
        g1 = Graph(prod_svg, (wx0, wx1), (10 + 30 + 5, 10 + 30 + 5 + 30), (0.0, 1.0), "darkgreen")

        for i, cell in sorted(cells.items()):
            inbounds = all(x0 - 50 < x < x1 + 50 and y0 - 50 < y < y1 + 50 for (x, y) in cell)
            if not inbounds:
                continue

            fixed = make_convex(cell)

            cx = centroid(fixed)[0]

            t = cx / (wx1 - wx0)
            v = 0.85 * (
                    0.5
                    + noise.snoise2(0, 1 * t)
                    + 0.5 * noise.snoise2(0, 2 * t + 100)
                    + 0.25 * noise.snoise2(0, 4 * t + 200)
            )
            v = geom.clamp(0, v, 1)
            g0.plot(cx, v)

            boost = inset_boost(v)
            g1.plot(cx, boost)

            inset_amount = self.cfg.line_width / 2.0 + boost

            p = inset(fixed, inset_amount)
            if p is None:
                continue

            cell = Polygon.Polygon(p)

            if len(cell & self.wall) == 0:
                continue

            c = centroid(cell.contour(0))
            a = cell.area(0)
            r = (a / pi) ** 0.5

            circle = Polygon.Polygon([p.point2 for p in circle_points(Vec(*c), r, 20)])

            debug_svg.add(debug_svg.polygon(cell.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))
            debug_svg.add(debug_svg.circle(c, r, fill_opacity=0, stroke="black", stroke_width=0.25))
            # svg.save()

            new = geom.interpolate_poly_circle(debug_svg, cell.contour(0), c, r, 1 - v)
            new = Polygon.Polygon([p.point2 for p in new])

            debug_svg.add(debug_svg.polygon(new.contour(0), fill_opacity=0, stroke="orange", stroke_width=0.25))

            cell &= self.window
            circle &= self.window
            new &= self.window

            self.result += new

        debug_svg.add(debug_svg.polygon(self.window.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))
        debug_svg.add(debug_svg.polygon(self.wall.contour(0), fill_opacity=0, stroke="black", stroke_width=0.25))

        self.result = self.wall - self.result
        # wall.result = wall.result | block
        # wall.result = wall.result - tunnel


class Graph:
    def __init__(self, svg, X, Y, y_range, color):
        self.svg = svg
        self.xmin, self.xmax = X
        self.ymin, self.ymax = Y
        self.y_scale = self.ymax - self.ymin
        self.y_range = y_range
        self.color = color

        self.axis()

    def plot(self, x, y):
        t = y * self.y_range[1] + (1 - y) * self.y_range[0]
        y_plot = self.ymax - t * self.y_scale

        self.svg.add(self.svg.circle(
            (x, y_plot),
            1.0,
            fill=self.color))

    def axis(self):
        self.svg.add(self.svg.line(
            (self.xmin, self.ymin),
            (self.xmax, self.ymin),
            stroke_width=1.5,
            opacity=0.5,
            stroke=self.color,
        ))

        self.svg.add(self.svg.line(
            (self.xmin, self.ymax),
            (self.xmax, self.ymax),
            stroke_width=1.5,
            opacity=0.5,
            stroke=self.color,
        ))


def inset_boost(t: float) -> float:
    return geom.clamp(0, -1 + 2 * t, 0.75)


def main():
    random.seed(42)

    prod_svg = svgwrite.Drawing(f'wall2.svg', profile='tiny')
    debug_svg = svgwrite.Drawing(f'wall2-.svg', profile='tiny')
    for i in range(8):
        wall = Wall(f"wall{i}", outer, x_offset=i * (146 + 10))
        wall.make(prod_svg, debug_svg)
        wall.to_svg(prod_svg)
        # wall.make_stl()

    prod_svg.save()
    debug_svg.save()


if __name__ == '__main__':
    main()
